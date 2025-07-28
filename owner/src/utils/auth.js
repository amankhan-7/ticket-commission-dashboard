export const getUserDisplayName = (userInfo) => {
  if (!userInfo) return "Guest";

  const { firstName, lastName, phone } = userInfo;

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else if (firstName) {
    return firstName;
  } else if (phone) {
    return phone;
  }

  return "User";
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }

  return phone;
};

const authUtils = {
  getUserDisplayName,
  formatPhoneNumber,
};

export default authUtils;
