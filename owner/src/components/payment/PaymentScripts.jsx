"use client";
import Script from "next/script";
import { PAYMENT_CONFIG } from "@/constants/payment";

export default function PaymentScripts() {
  return (
    <Script
      src={PAYMENT_CONFIG.RAZORPAY_SCRIPT_URL}
      strategy="afterInteractive"
    />
  );
}
