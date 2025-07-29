"use client";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signInPhoneSchema } from "@/utils/validations/form-validation";

export default function PhonePage({ onSubmit }) {
  const form = useForm({
    resolver: zodResolver(signInPhoneSchema),
    defaultValues: {
      phone: "",
      tnc: true,
    },
  });
  return (
    <Card className="shadow-none flex flex-col md:self-center max-w-[420px] w-full border-none p-0 animate-in fade-in slide-in-from-bottom-2 duration-300 gap-0 h-fit">
      <CardHeader className="mb-7 md:mb-[1.875rem] flex flex-col items-center md:items-start p-0">
        <CardTitle className="text-2xl font-semibold text-primary md:text-[1.8rem]">
          Login to continue
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="mb-5 gap-0">
                  <FormLabel className="font-medium text-[1rem] text-[var(--text-color)] mb-2.5">
                    Enter your phone number
                  </FormLabel>{" "}
                  <FormControl>
                    <Input
                      placeholder="10-digit mobile number"
                      {...field}
                      className="md:text-[1.2rem] h-14 w-full border focus-visible:border-primary focus:shadow-[0_0_0_3px_rgba(0,74,173,0.15)] p-3.5 "
                    />
                  </FormControl>
                  <FormDescription className="mt-2">
                    We'll send you a verification code
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tnc"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                  <FormControl>
                    <Checkbox
                      {...field}
                      className="self-center m-0"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-muted-foreground h-fit font-normal self-center w-full">
                    <div className="h-fit">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-primary hover:underline inline-block p-0 mt-1"
                      >
                        Terms & Conditions
                      </Link>
                      {" "}and{" "}
                      <Link
                        href="/privacy"
                        className="text-primary hover:underline inline-block p-0 mt-1"
                      >
                        Privacy Policy
                      </Link>
                    </div>
                  </FormLabel>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full mt-4 p-3.5  h-12 tracking-[0.5px] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
            >
              Get OTP
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
