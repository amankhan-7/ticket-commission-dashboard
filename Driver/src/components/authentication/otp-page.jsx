"use client";
import useCountdown from "@/hooks/useCountdown";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CodeInput from "@/components/ui/code-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { signInOTPSchema } from "@/utils/validations/form-validation";

export default function OTPPage({ onBack, onSubmit, onResend }) {
  const { countdown, resetCountdown } = useCountdown(30);

  const form = useForm({
    resolver: zodResolver(signInOTPSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleOnBack = () => {
    form.reset();
    resetCountdown();
    onBack();
  };
  const handleResendOTP = () => {
    if (countdown > 0) return;
    onResend();
    resetCountdown();
  };

  return (
    <Card className="shadow-none flex flex-col self-center max-w-[450px] w-full border-none py-0 px-3.5 animate-in fade-in slide-in-from-bottom-2 duration-300 gap-0 h-fit">
      <CardHeader className="px-0 bottom-0">
        <Button
          onClick={handleOnBack}
          className="w-fit p-2 h-10 md:mb-4 mb-[1.5625rem] bg-primary text-white hover:bg-secondary hover:text-white px-4 py-2 text-sm font-normal text-center"
        >
          <ArrowLeft className="w-4 h-4" />
          Back{" "}
        </Button>
        <CardTitle className="text-2xl font-semibold text-primary md:text-[1.8rem] text-center m-0 md:mb-[1.875rem]">
          Enter verification code
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="my-[1.5625rem] mt-[1.875rem] flex flex-row items-center justify-center">
                  <FormControl>
                    <CodeInput
                      length={5}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.watch("otp")?.length !== 5}
              className="w-full h-fit font-medium md:text-[1.1rem] tracking-[0.5px] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 p-3.5 md:p-4 mt-2.5 cursor-pointer"
            >
              Verify & Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center items-center mt-4">
        {countdown > 0 ? (
          <p>Resend OTP in {countdown}s</p>
        ) : (
          <Button
            variant="link"
            onClick={handleResendOTP}
            className="text-primary hover:underline p-0 "
          >
            Resend OTP
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
