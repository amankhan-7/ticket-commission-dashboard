"use client";
import PhonePage from "@/components/authentication/counterPerson/phone-page";
import AuthGuard from "@/components/wrapper/AuthGuard";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useCounterPersonLoginMutation } from "@/utils/redux/api/loginAuth"; // updated mutation
import { setCredentials } from "@/utils/redux/slices/authSlice";

export default function CounterPersonLogin() {
  return (
    <AuthGuard redirectTo="/" requireAuth={false}>
      <LoginComponent />
    </AuthGuard>
  );
}

function LoginComponent() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [counterPersonLogin, { isLoading }] = useCounterPersonLoginMutation();

  const handleLoginSubmit = async (data) => {
    const { phone, pin } = data;

    try {
      const result = await counterPersonLogin({ phone, pin }).unwrap();

      if (result) {
        // Save credentials in redux
        await dispatch(
          setCredentials({
            user: result.counterPerson,
            userType: "counterPerson",
            token: result.token,
          })
        ).unwrap();

        toast.success("Login successful!");
        router.push("/booking-dashboard"); // redirect to dashboard/home
      } else {
        toast.error("Login failed. Please check your phone and PIN.");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.status === 401) {
        toast.error("Invalid PIN.");
      } else if (error.status === 404) {
        toast.error("Counter person not found.");
      } else if (error.status === 403) {
        toast.error(error.data?.message || "Account is inactive.");
      } else if (error.status === 423) {
        toast.error(error.data?.message || "Account temporarily locked.");
      } else {
        toast.error(error.data?.message || "Login failed. Try again.");
      }
    }
  };

  return (
    <main className="flex md:items-center justify-center h-fit md:min-h-screen pt-[6.25rem] md:p-0 px-5">
      <PhonePage onSubmit={handleLoginSubmit} isLoading={isLoading} />
    </main>
  );
}
