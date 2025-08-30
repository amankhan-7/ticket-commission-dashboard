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
    <Card className="p-6 gap-0 rounded-md shadow-sm">
      <CardHeader className="text-lg font-bold text-primary p-0">
        Edit Profile
      </CardHeader>

      <CardContent className="p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="flex flex-col mb-[1.25rem] max-md:flex-col max-md:gap-[1.25rem]"
          >
            <div className="flex flex-row justify-between w-full gap-[1.25rem]">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="mb-[1.25rem] w-full">
                    <FormLabel className="block mb-[0.5rem] font-semibold text-base leading-6 text-[var(--text-color)]">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your first name"
                        className="w-full px-[0.9375rem] py-[0.75rem] border border-[var(--border-color)] text-base transition-colors focus-visible:border focus-visible:border-primary 
                      min-h-fit
                          "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="mb-[1.25rem] w-full">
                    <FormLabel className="block mb-[0.5rem] font-semibold text-base leading-6 text-[var(--text-color)]">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your last name"
                        className="w-full px-[0.9375rem] py-[0.75rem] border border-[var(--border-color)] text-base transition-colors focus-visible:border focus-visible:border-primary 
                      min-h-fit
                      "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="mb-[1.25rem]">
                  <FormLabel className="block mb-[0.5rem] font-[500] text-[var(--text-color)] text-base">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="10-digit mobile number"
                      readOnly
                      disabled
                      className="w-full px-[0.9375rem] py-[0.75rem] border border-[var(--border-color)] text-base 
                          min-h-fit
                          focus:outline-none focus:border-primary
                          disabled:text-[var(--text-color)] disabled:cursor-not-allowed
                          disabled:opacity-100
                          cursor-not-allowed"
                    />
                  </FormControl>
                  <FormDescription>
                    Phone number cannot be changed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email Address{" "}
                    <span className="font-normal">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      autoComplete="email"
                      placeholder="Your email address"
                      className="w-full px-[0.9375rem] py-[0.75rem] border border-[var(--border-color)] text-base transition-colors
                    focus:outline-none
                      min-h-fit
                       focus-visible:border focus-visible:border-primary "
                    />
                  </FormControl>
                  <FormDescription className="mt-[0.375rem] text-[0.85rem] text-[#666]">
                    For receiving e-tickets and updates
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-[1.5625rem] py-[0.75rem] bg-primary text-white font-[500] text-base transition-colors min-h-fit"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={onCancel}
                className="flex-1 py-[0.75rem] min-h-fit"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
