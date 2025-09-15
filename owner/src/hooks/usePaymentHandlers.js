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
  createBookingMutation,
  confirmOnlinePaymentMutation,
  setProcessing,
  currentUser
) => {
  const router = useRouter();

  const createRazorpayOrder = async (
    formData,
    bookingData,
    routeId,
    seatNumbers,
    journeyDate
  ) => {
    setProcessing(true);

    const bookingResult = await createBookingMutation({
      ...bookingData,
      paymentType: 'online'
    }).unwrap();

    const { booking, paymentOrder } = bookingResult;

    return { bookingId: booking.id, paymentOrder };
  };

  const handlePaymentSuccess = async (response, bookingId, amount, onSuccess) => {
    try {
      const result = await confirmOnlinePaymentMutation({
        bookingId,
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
        paymentMethod: PAYMENT_CONFIG.DEFAULT_PAYMENT_METHOD,
      }).unwrap();

      toast.success("Payment successful! Booking confirmed.");
      
      // Call the success callback with the booking data
      if (onSuccess) {
        onSuccess(result.booking);
      }
    } catch (err) {
      console.error("Booking confirmation failed:", err);
      toast.success(
        "Payment succeeded, but booking failed. Please contact support."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentFailure = (response, bookingId) => {
    console.error("Razorpay payment failed:", response.error);
    toast.error(`Payment Failed\nReason: ${response.error.description}`);
    setProcessing(false);
  };

  const handlePaymentCancel = (bookingId) => {
    console.log("Payment cancelled by user");
    toast.error("Payment was cancelled. You can retry your payment.");
    setProcessing(false);
  };

  const initiateRazorpayPayment = (
    paymentOrder,
    formData,
    onSuccess,
    onFailure,
    onCancel
  ) => {
    try {
      validateRazorpayAvailability();
    } catch (error) {
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
      modal: {
        ondismiss: onCancel
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", onFailure);
    rzp.on("payment.success", onSuccess);
    rzp.open();
  };

  const processOnlinePayment = async (
    formData,
    bookingData,
    routeId,
    seatNumbers,
    journeyDate,
    onSuccess
  ) => {
    try {
      const { bookingId, paymentOrder } = await createRazorpayOrder(
        formData,
        bookingData,
        routeId,
        seatNumbers,
        journeyDate
      );

      initiateRazorpayPayment(
        paymentOrder,
        formData,
        (response) =>
          handlePaymentSuccess(response, bookingId, paymentOrder?.amount, onSuccess),
        (response) => handlePaymentFailure(response, bookingId),
        () => handlePaymentCancel(bookingId)
      );
    } catch (err) {
      console.error("Payment setup failed:", err);
      toast.error(formatPaymentError(err));
      setProcessing(false);
    }
  };

  return { processOnlinePayment };
};