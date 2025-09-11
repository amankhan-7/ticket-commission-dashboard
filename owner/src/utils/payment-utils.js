export const validateRazorpayAvailability = () => {
  if (typeof window === 'undefined') {
    throw new Error("Window object not available");
  }
  if (!window.Razorpay) {
    throw new Error("Razorpay failed to load. Please refresh the page and try again.");
  }
};

export const createPassengerDetails = (formData) => {
  return {
    name: `${formData.firstName} ${formData.lastName}`.trim(),
    age: formData.age,
    gender: formData.gender,
    email: formData.email,
    phone: formData.phone,
  };
};

export const createPrefillData = (formData) => {
  return {
    name: `${formData.firstName} ${formData.lastName}`.trim(),
    email: formData.email,
    contact: formData.phone,
  };
};

export const formatPaymentError = (error) => {
  if (error?.data?.message) {
    return error.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return "Payment processing failed. Please try again.";
};
