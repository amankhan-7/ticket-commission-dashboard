"use client";
import PhonePage from "@/components/authentication/ticketExecutive/phone-page";
import AuthGuard from "@/components/wrapper/AuthGuard";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useTicketExecutiveLoginMutation } from "@/utils/redux/api/loginAuth";
import { setCredentials } from "@/utils/redux/slices/authSlice";

export default function TicketExecutiveLogin() {
  return (
    <AuthGuard redirectTo="/" requireAuth={false}>
      <LoginComponent />
    </AuthGuard>
  );
}

function LoginComponent() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [ticketExecutiveLogin, { isLoading }] = useTicketExecutiveLoginMutation();

  const handleLoginSubmit = async (data) => {
    const { phone, pin } = data;

    try {
      const result = await ticketExecutiveLogin({ phone, pin }).unwrap();

      if (result) {
        await dispatch(
          setCredentials({
            executive: result.executive,
            userType: "executive",
            token: result.token,
          })
        ).unwrap();

        toast.success("Login successful!");
        router.push("/"); // redirect to dashboard/home
      } else {
        toast.error("Login failed. Please check your phone and PIN.");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.status === 401) {
        toast.error("Invalid PIN.");
      } else if (error.status === 404) {
        toast.error("Ticket executive not found.");
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
