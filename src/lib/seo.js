

export const SEO_CONFIG = {
  siteName: "SmallBus",
  siteUrl: process.env.NEXT_PUBLIC_URL || "https://smallbus.in",
  defaultTitle:
    "SmallBus - Book Bus Tickets Online | Affordable & Reliable Bus Travel",
  titleTemplate: "%s | SmallBus",

  defaultDescription:
    "Book bus tickets online with SmallBus. Find the best deals on bus travel across India. Safe, affordable, and reliable bus booking platform with instant confirmation.",

  defaultKeywords: [
    "bus tickets",
    "online bus booking",
    "bus travel India",
    "cheap bus tickets",
    "bus reservation",
    "intercity bus",
    "travel booking",
    "SmallBus",
    "bus schedule",
    "book bus online",
  ],

  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "SmallBus",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "SmallBus - Online Bus Booking Platform",
      },
    ],
  },

  // Twitter defaults
  twitter: {
    card: "summary_large_image",
    creator: "@smallbus",
    images: ["/logo.svg"],
  },

  // Organization schema
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SmallBus",
    url: process.env.NEXT_PUBLIC_URL || "https://smallbus.in",
    logo: `${process.env.NEXT_PUBLIC_URL || "https://smallbus.in"}/logo.svg`,
    description:
      "Online bus ticket booking platform for affordable and reliable bus travel across India",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-XXXXXXXXXX",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [
      "https://instagram.com/smallbus.official",
    ],
  },

  pages: {
    home: {
      title: "Book Bus Tickets Online - Best Deals on Bus Travel | SmallBus",
      description:
        "Find and book bus tickets online at SmallBus. Compare prices, choose from multiple operators, and travel comfortably across India. Best deals guaranteed with instant booking confirmation.",
      keywords: [
        "book bus tickets online",
        "bus booking India",
        "cheap bus tickets",
        "bus travel deals",
        "online bus reservation",
        "intercity bus booking",
        "bus schedule India",
        "travel booking platform",
      ],
    },

    buses: {
      title: "Bus Search Results | SmallBus",
      description:
        "Search results for bus routes. Compare prices, timings, and amenities across different bus operators.",
      robots: "index,follow",
    },

    seat: {
      title: "Select Your Seats - Choose Your Preferred Bus Seats | SmallBus",
      description:
        "Select your preferred bus seats with our interactive seat map. Choose window, aisle, or any specific seats for your comfort.",
      robots: "noindex,follow",
    },

    payment: {
      title: "Complete Your Payment - Secure Bus Ticket Booking | SmallBus",
      description:
        "Complete your bus ticket booking with secure payment options. Fast, safe, and reliable payment processing.",
      robots: "noindex,nofollow",
    },

    login: {
      title: "Login to SmallBus - Access Your Account | SmallBus",
      description:
        "Login to your SmallBus account to book tickets, view bookings, and manage your travel preferences.",
      robots: "noindex,follow",
    },

    account: {
      title: "My Account - Manage Your Profile & Bookings | SmallBus",
      description:
        "Manage your SmallBus account, view booking history, update personal information, and track your travel preferences.",
      robots: "noindex,nofollow",
    },

    help: {
      title: "Help Center - Get Support & Find Answers | SmallBus",
      description:
        "Get help with your bus booking, find answers to frequently asked questions, contact customer support, and access travel assistance.",
      robots: "index,follow",
    },

    terms: {
      title: "Terms and Conditions - SmallBus Legal Terms | SmallBus",
      description:
        "Read SmallBus terms and conditions for bus ticket booking, cancellation policies, user responsibilities, and service agreements.",
      robots: "index,follow",
    },

    privacy: {
      title: "Privacy Policy - How We Protect Your Data | SmallBus",
      description:
        "Learn how SmallBus protects your personal information, data collection practices, privacy rights, and security measures.",
      robots: "index,follow",
    },
  },

  structuredData: {
    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "SmallBus",
      url: process.env.NEXT_PUBLIC_URL || "https://smallbus.in",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${
            process.env.NEXT_PUBLIC_URL || "https://smallbus.in"
          }/buses?from={search_term_string}&to={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },

    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [],
    },
  },
};

export const generateRouteTitle = (from, to, date) => {
  return `Buses from ${from} to ${to}${date ? ` - ${date}` : ""} | ${
    SEO_CONFIG.siteName
  }`;
};

export const generateRouteDescription = (from, to, date) => {
  return `Find and book buses from ${from} to ${to}${
    date ? ` on ${date}` : ""
  }. Compare prices, timings, and amenities. Book your bus ticket online with ${
    SEO_CONFIG.siteName
  } for a comfortable journey.`;
};

export const generateRouteKeywords = (from, to) => {
  return [
    `${from} to ${to} bus`,
    `bus booking ${from} ${to}`,
    `${from} ${to} bus tickets`,
    `online bus booking`,
    `bus schedule ${from} ${to}`,
    "cheap bus tickets",
    "bus travel India",
    `${SEO_CONFIG.siteName} booking`,
  ];
};
