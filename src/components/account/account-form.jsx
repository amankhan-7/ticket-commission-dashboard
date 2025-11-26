"use client";

import { accountDetailSchema } from "@/utils/validations/form-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  useUpdateCounterPersonProfileMutation,
  useUpdateTicketExecutiveProfileMutation,
} from "@/utils/redux/api/loginAuth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { FormSkeleton } from "@/components/ui/skeletons";

export default function AccountForm() {
  const {
    user: userInfo,
    updateUser: updateUserInfo,
    isLoading: isAuthLoading,
  } = useAuth();

  const [updateCounterPerson, counterPersonState] =
    useUpdateCounterPersonProfileMutation();

  const [updateTicketExecutive, executiveState] =
    useUpdateTicketExecutiveProfileMutation();

  const isLoading =
    isAuthLoading || counterPersonState.isLoading || executiveState.isLoading;

  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(accountDetailSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (userInfo) {
      form.reset({
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        phone: userInfo.phone || "",
        email: userInfo.email || "",
      });
    }
  }, [userInfo, form]);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <FormSkeleton />
      </div>
    );
  }

  const handleFormSubmit = async (data) => {
    if (!userType) {
      console.warn("User type not loaded yet. Please wait.");
      return; // prevent submission until we know the role
    }

    try {
      let res;

      if (userType === "ticketExecutive") {
        res = await updateTicketExecutive(data).unwrap();
      } else if (userType === "counterPerson") {
        res = await updateCounterPerson(data).unwrap();
      } else {
        console.error("Unknown user type:", userType);
        return;
      }

      const updatedProfile = res.data.profile;

      updateUserInfo({
        ...userInfo,
        ...updatedProfile,
      });

      toast.success("Account updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update account. Please try again.");
    }
  };

  const onCancel = () => {
    form.reset({
      firstName: userInfo.firstName || "",
      lastName: userInfo.lastName || "",
      phone: userInfo.phone || "",
      email: userInfo.email || "",
    });

    router.push("/account");
  };

  return (
    <div className="px-0 sm:px-6 md:px-8 lg:ml-18">
      <Card
        className="rounded-xl shadow-lg border-t-4 mb-6"
        style={{ borderTopColor: "#004AAD" }}
      >
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#013881] via-[#004aad] to-blue-300 bg-clip-text text-transparent">
            Edit Profile
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)}>
              {/* Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* First Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Your first name"
                          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-[#004AAD]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Name */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Your last name"
                          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-[#004AAD]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone (readonly) */}
              <div className="mt-5">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          disabled
                          className="rounded-lg border-gray-300 bg-gray-100 text-gray-700"
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-1">
                        Phone number cannot be changed.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <div className="mt-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address (optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="you@example.com"
                          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-[#004AAD]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <button
                  type="submit"
                  disabled={isLoading || !userType}
                  className="bg-[#004AAD] text-white px-5 py-2.5 rounded-lg font-semibold shadow hover:bg-[#013881] transition disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={onCancel}
                  className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-semibold bg-white hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
