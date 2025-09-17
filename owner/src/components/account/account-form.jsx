"use client";
import { accountDetailSchema } from "@/utils/validations/form-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/utils/redux/api/userSlice";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { FormSkeleton } from "@/components/ui/skeletons";

export default function AccountForm() {
  const [updateUser, { isLoading }] = useUpdateUserProfileMutation();
  const {
    user: userInfo,
    updateUser: updateUserInfo,
    isLoading: isAuthLoading,
  } = useAuth();
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
    try {
      const result = await updateUser({
        ...data,
        userId: userInfo.id,
      }).unwrap();

      const updatedUser = {
        ...userInfo,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
      };
      await updateUserInfo(updatedUser);

      toast.success("Account updated successfully!");
    } catch (error) {
      console.error("Error updating account:", error);
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
   <section className="bg-white rounded-[12px] p-6 mb-6 shadow max-w-5xl mx-auto w-full animate-fadeInUp">
  <h2 className="text-[#004aad] mb-4 text-lg font-semibold">
    Edit Profile
  </h2>

  <Form {...form}>
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
      {/* Grid layout for inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* First Name */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block mb-2 text-sm font-medium text-gray-700">
                First Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Your first name"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-800 transition duration-200 ease-in-out text-gray-700"
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
              <FormLabel className="block mb-2 text-sm font-medium text-gray-700">
                Last Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Your last name"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-800 transition duration-200 ease-in-out text-gray-700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Phone Number (readonly) */}
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel className="block mb-2 text-sm font-medium text-gray-700">
              Phone Number
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="tel"
                placeholder="10-digit mobile number"
                readOnly
                disabled
                className="w-full p-2 border border-slate-200 rounded-lg text-sm text-gray-700 disabled:opacity-100 disabled:cursor-not-allowed"
              />
            </FormControl>
            <FormDescription className="text-xs text-gray-500 mt-1">
              Phone number cannot be changed.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel className="block mb-2 text-sm font-medium text-gray-700">
              Email Address <span className="font-normal">(optional)</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                autoComplete="email"
                placeholder="Your email address"
                className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-800 transition duration-200 ease-in-out text-gray-700"
              />
            </FormControl>
            {/* <FormDescription className="text-xs text-gray-500 mt-1">
              For account recovery purpose.
            </FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Buttons */}
      <div className="flex flex-col  md:flex-row gap-3 md:item-start">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#004aad] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-900 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className=" gap-2 bg-white text-gray-600 text-sm font-medium border border-gray-300 rounded-md px-4 py-2 hover:bg-[#f5f7fa] transition duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  </Form>
</section>

  );
}
