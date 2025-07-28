"use client";
import OTPPage from "@/components/authentication/otp-page";
import LoginPage from "@/components/authentication/phone-page";
import RegisterPage from "@/components/authentication/register-page";
import AuthGuard from "@/components/wrapper/AuthGuard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  useInitiateLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
} from "@/utils/redux/api/user";
import { setCredentials } from "@/utils/redux/slices/authSlice";
import { useSEO } from "@/hooks/useSEO";
import { SEO_CONFIG } from "@/config/seo";

const STEPS = {
  PHONE: 1,
  OTP: 2,
  REGISTER: 3,
};

export default function Login() {
  useSEO({
    title: SEO_CONFIG.pages.login.title,
    description: SEO_CONFIG.pages.login.description,
    url: `${SEO_CONFIG.siteUrl}/login`,
    robots: SEO_CONFIG.pages.login.robots,
    openGraph: {
      title: SEO_CONFIG.pages.login.title,
      description: SEO_CONFIG.pages.login.description,
      url: `${SEO_CONFIG.siteUrl}/login`,
    },
  });

  return (
    <AuthGuard redirectTo="/" requireAuth={false}>
      <LoginComponent />
    </AuthGuard>
  );
}

function LoginComponent() {
  const [step, setStep] = useState(STEPS.PHONE);
  const [phoneData, setPhoneData] = useState(null);

  const router = useRouter();
  const dispatch = useDispatch();

  const [initiateLogin, { isLoading: isSendingOtp }] =
    useInitiateLoginMutation();
  const [verifyOtp, { isLoading: isLoggingIn }] = useVerifyOtpMutation();
  const [register] = useRegisterMutation();

  const handleError = (error, defaultMessage) => {
    if (error?.data?.message) {
      toast.error(error.data.message);
    } else if (error?.message) {
      toast.error(error.message);
    } else {
      toast.error(defaultMessage);
    }
  };

  const handleResendOTP = async () => {
    try {
      const result = await initiateLogin({
        phoneNumber: phoneData.phone,
      }).unwrap();

      if (result.success) {
        toast.success("OTP resent successfully");
      } else {
        toast.error(
          result.message || "Failed to resend OTP. Please try again."
        );
      }
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      handleError(error, "Failed to resend OTP. Please try again.");
    }
  };
  const handlePhoneSubmit = async (data) => {
    try {
      const result = await initiateLogin({ phoneNumber: data.phone }).unwrap();

      if (result) {
        setPhoneData(data);
        setStep(STEPS.OTP);
      } else {
        toast.error(result.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.warn("Failed to send OTP:", error);
      if (error.status === 404 || error.data?.message?.includes("not found")) {
        setPhoneData(data);
        setStep(STEPS.REGISTER);
      } else {
        handleError(error, "Failed to send OTP. Please try again.");
      }
    }
  };

  const handleOTPSubmit = async ({ otp }) => {
    try {
      const result = await verifyOtp({
        phoneNumber: phoneData.phone,
        otp,
        purpose: "login",
      }).unwrap();

      if (result) {
        try {
          await dispatch(setCredentials({ user: result.user })).unwrap();
          toast.success("Login successful!");
          router.push("/");
        } catch (error) {
          console.error("Failed to set credentials:", error);
          toast.error("Login failed. Please try again.");
        }
      } else {
        toast.error(result.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      handleError(error, "Invalid OTP. Please try again.");
    }
  };

  const handleRegisterSubmit = async (data) => {
    try {
      const result = await register({
        phoneNumber: phoneData.phone,
        firstName: data.firstName,
        lastName: data.lastName,
      }).unwrap();

      if (result) {
        setPhoneData({
          phone: phoneData.phone,
          firstName: data.firstName,
          lastName: data.lastName,
        });

        try {
          const otpResult = await initiateLogin({
            phoneNumber: phoneData.phone,
          }).unwrap();

          if (otpResult) {
            toast.success("Registration successful! Please verify OTP.");
            setStep(STEPS.OTP);
          } else {
            toast.error(
              otpResult.message || "Failed to send OTP. Please try again."
            );
          }
        } catch (error) {
          console.error("Failed to send OTP after registration:", error);
          toast.error(
            "Registration successful but failed to send OTP. Please try logging in."
          );
          setStep(STEPS.PHONE);
        }
      } else {
        toast.error(result.message || "Failed to register. Please try again.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      handleError(error, "Failed to register. Please try again.");
    }
  };
  const handleBack = () => {
    setStep(STEPS.PHONE);
  };

  const renderStep = () => {
    switch (step) {
      case STEPS.PHONE:
        return (
          <LoginPage onSubmit={handlePhoneSubmit} isLoading={isSendingOtp} />
        );

      case STEPS.OTP:
        return (
          <OTPPage
            onSubmit={handleOTPSubmit}
            onBack={handleBack}
            onResend={handleResendOTP}
            isLoading={isLoggingIn}
            isResending={isSendingOtp}
          />
        );

      case STEPS.REGISTER:
        return (
          <RegisterPage onBack={handleBack} onSubmit={handleRegisterSubmit} />
        );

      default:
        return (
          <LoginPage onSubmit={handlePhoneSubmit} isLoading={isSendingOtp} />
        );
    }
  };

  return (
    <main className="flex md:items-center justify-center h-fit md:min-h-screen pt-[6.25rem] md:p-0 px-5">
      {renderStep()}
    </main>
  );
}
