import { useRouter } from "next/navigation";
import { PAYMENT_CONFIG } from "@/constants/payment";
import {
  createPassengerDetails,
  validateRazorpayAvailability,
  formatPaymentError,
  createPrefillData,
} from "@/utils/payment-utils";
import { toast } from "sonner";

export const usePaymentHandlers = (
  createBooking,
  confirmPayment,
  setProcessing,
  currentUser
) => {
  const router = useRouter();

  const handlePaymentSuccess = async (response, bookingId, amount) => {
    try {
      await confirmPayment({
        bookingId,
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
        paymentMethod: PAYMENT_CONFIG.DEFAULT_PAYMENT_METHOD,
      });

      toast.success("Payment successful! Booking confirmed.");
      return { success: true, bookingId, paymentId: response.razorpay_payment_id };
    } catch (err) {
      console.error("Booking confirmation failed:", err);
      toast.error("Payment succeeded, but booking failed. Please contact support.");
      return { success: false, error: err.message };
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentFailure = (response) => {
    console.error("Razorpay payment failed:", response.error);
    toast.error(`Payment Failed\nReason: ${response.error.description}`);
    setProcessing(false);
  };

  const waitForRazorpay = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      const interval = setInterval(() => {
        attempts++;
        if (window.Razorpay) {
          clearInterval(interval);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error("Razorpay script failed to load within timeout"));
        }
      }, 100);
    });
  };

  const initiateRazorpayPayment = async (
    paymentOrder,
    formData,
    onSuccess,
    onFailure
  ) => {
    try {
      await waitForRazorpay();
      validateRazorpayAvailability();
    } catch (error) {
      console.error("Razorpay validation failed:", error);
      toast.error(error.message);
      setProcessing(false);
      return;
    }

    const options = {
      key: paymentOrder.key,
      amount: paymentOrder.amount,
      currency: PAYMENT_CONFIG.CURRENCY,
      name: PAYMENT_CONFIG.COMPANY_NAME,
      description: PAYMENT_CONFIG.DESCRIPTION,
      order_id: paymentOrder.id,
      handler: onSuccess,
      prefill: createPrefillData(formData),
      theme: { color: PAYMENT_CONFIG.THEME_COLOR },
    };
      console.log("Opening Razorpay with options:", options);

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", onFailure);
    rzp.on("payment.success", onSuccess);
    rzp.open();
  };

  const processPayment = async (
    formData,
    bookingData,
    onSuccess,
    onFailure
  ) => {
    try {
      const result = await createBooking(bookingData).unwrap();
      
      if (result.success && result.data.paymentOrder) {
        await initiateRazorpayPayment(
          result.data.paymentOrder,
          formData,
          (response) => onSuccess(response, result.data.booking.id, result.data.paymentOrder.amount),
          onFailure
        );
      } else {
        throw new Error("Failed to create booking");
      }
    } catch (err) {
      console.error("Booking creation or Razorpay setup failed:", err);
      toast.error(formatPaymentError(err));
      setProcessing(false);
    }
  };

  return { processPayment, handlePaymentSuccess, handlePaymentFailure };
};
