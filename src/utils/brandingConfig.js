// Branding Configuration for PDF Tickets
// Customize these values to match your company branding

export const BRAND_CONFIG = {
  // Company Information
  companyName: "smallbus",
  tagline: "We help you travel - smoothly",

  // Colors (RGB format)
  primaryColor: [52, 152, 219], // Main brand color (Blue)
  secondaryColor: [41, 128, 185], // Secondary color (Darker blue)
  accentColor: [44, 62, 80], // Accent color for text (Dark blue)

  // Logo Configuration
  logoPath: "/logo.png", // Path to your logo file in /public
  logoSize: 14, // Logo size in pixels
  // Optional: embed base64 data URL for maximum reliability in jsPDF
  // Example: 'data:image/png;base64,iVBORw0KGgoAAAANS...'
  logoDataUrl: "",

  // Contact Information
  website: "www.smallbus.in",
  supportEmail: "support@smallbus.in",
  supportPhone: "+91-XXXXXXXXXX",

  // Address (optional)
  address: {
    street: "123 Bus Terminal Road",
    city: "Patna",
    state: "Bihar",
    pincode: "800001",
    country: "India",
  },

  // Social Media (optional)
  socialMedia: {
    facebook: "facebook.com/smallbus.official",
    twitter: "twitter.com/smallbus",
    instagram: "instagram.com/smallbus.official",
  },

  // Legal Information
  legal: {
    companyRegNumber: "REG123456789",
    gstNumber: "GST123456789",
    termsUrl: "www.smallbus.in/terms",
    privacyUrl: "www.smallbus.in/privacy",
  },
};

// Alternative branding themes (you can switch between these)
export const BRAND_THEMES = {
  default: BRAND_CONFIG,

  // Professional theme
  professional: {
    ...BRAND_CONFIG,
    primaryColor: [34, 40, 49], // Dark professional
    secondaryColor: [48, 71, 94], // Navy blue
    accentColor: [133, 146, 158], // Gray
  },

  // Modern theme
  modern: {
    ...BRAND_CONFIG,
    primaryColor: [0, 122, 255], // iOS blue
    secondaryColor: [88, 86, 214], // Purple
    accentColor: [255, 149, 0], // Orange
  },

  // Corporate theme
  corporate: {
    ...BRAND_CONFIG,
    primaryColor: [0, 0, 0], // Black
    secondaryColor: [128, 128, 128], // Gray
    accentColor: [255, 255, 255], // White
  },
};

// Function to get current branding theme
export const getCurrentBranding = (theme = "default") => {
  return BRAND_THEMES[theme] || BRAND_THEMES.default;
};
