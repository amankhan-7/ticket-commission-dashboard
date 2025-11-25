import { PAYMENT_CONFIG } from "@/constants/payment";
import Script from "next/script";

export default function PaymentScripts() {
  return (
    <Script
      src={PAYMENT_CONFIG.RAZORPAY_SCRIPT_URL}
      strategy="afterInteractive"
    />
  );
}