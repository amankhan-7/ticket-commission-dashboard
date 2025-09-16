export const PAYMENT_CONFIG = {
  RAZORPAY_SCRIPT_URL: "https://checkout.razorpay.com/v1/checkout.js",
  CURRENCY: "INR",
  COMPANY_NAME: "SmallBus",
  DESCRIPTION: "Bus seat booking",
  THEME_COLOR: "#004aad",
  DEFAULT_PAYMENT_METHOD: "upi",
};

export const formDefaults = (data) => {
  return {
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    age: data?.age || "",
    gender: data?.gender || "",
    email: data?.email || "",
    phone: data?.phone || data?.phoneNumber || "",
  };
};

export const BOOKING_INITIAL_STATE = {
  id: "",
  bus: "",
  from: "",
  to: "",
  date: "",
  timeofdeparture: "",
  timeofarrival: "",
  seatid: [],
  price: "",
};