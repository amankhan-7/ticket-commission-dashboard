import { useEffect } from "react";
import {
  updatePageTitle,
  updateMetaDescription,
  updateOpenGraphTags,
  updateCanonicalUrl,
  updateRobotsTag,
} from "@/utils/seo";
import {
  SEO_CONFIG,
  generateRouteTitle,
  generateRouteDescription,
} from "@/config/seo";

/**
 * Custom hook for managing SEO metadata in client components
 * @param {Object} seoData - SEO configuration object
 * @param {string} seoData.title - Page title
 * @param {string} seoData.description - Meta description
 * @param {string} seoData.url - Canonical URL
 * @param {string} seoData.robots - Robots directive
 * @param {Object} seoData.openGraph - Open Graph data
 */
export const useSEO = (seoData) => {
  useEffect(() => {
    if (seoData.title) {
      updatePageTitle(seoData.title);
    }

    if (seoData.description) {
      updateMetaDescription(seoData.description);
    }

    if (seoData.openGraph) {
      updateOpenGraphTags(
        seoData.openGraph.title || seoData.title,
        seoData.openGraph.description || seoData.description,
        seoData.openGraph.url || seoData.url
      );
    }

    if (seoData.url) {
      updateCanonicalUrl(seoData.url);
    }

    if (seoData.robots) {
      updateRobotsTag(seoData.robots);
    }
  }, [seoData]);
};

/**
 * Hook specifically for bus route pages
 * @param {string} fromCity - Departure city
 * @param {string} toCity - Destination city
 * @param {string} travelDate - Travel date
 * @param {Array} buses - Array of bus data
 */
export const useBusRouteSEO = (fromCity, toCity, travelDate, buses = []) => {
  const seoData = {
    title:
      fromCity && toCity
        ? generateRouteTitle(fromCity, toCity, travelDate)
        : `Find Bus Routes | ${SEO_CONFIG.siteName}`,
    description:
      fromCity && toCity
        ? generateRouteDescription(fromCity, toCity, travelDate)
        : SEO_CONFIG.defaultDescription,
    url: typeof window !== "undefined" ? window.location.href : "",
    robots: "index,follow",
    openGraph: {
      title:
        fromCity && toCity && travelDate
          ? `Buses from ${fromCity} to ${toCity} - ${travelDate}`
          : "Find Bus Routes",
      description:
        fromCity && toCity && travelDate
          ? `Find buses from ${fromCity} to ${toCity} on ${travelDate}. Book online with ${SEO_CONFIG.siteName}.`
          : SEO_CONFIG.defaultDescription,
    },
  };

  useSEO(seoData);

  useEffect(() => {
    if (
      fromCity &&
      toCity &&
      buses.length > 0 &&
      typeof document !== "undefined"
    ) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "TravelAction",
        object: {
          "@type": "Trip",
          name: `Bus journey from ${fromCity} to ${toCity}`,
          description: `Find buses from ${fromCity} to ${toCity}`,
          provider: {
            "@type": "Organization",
            name: SEO_CONFIG.siteName,
            url: SEO_CONFIG.siteUrl,
          },
        },
        fromLocation: {
          "@type": "Place",
          name: fromCity,
        },
        toLocation: {
          "@type": "Place",
          name: toCity,
        },
        offers: buses.slice(0, 5).map((bus) => ({
          "@type": "Offer",
          price: bus.price,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        })),
      };

      const existingScript = document.querySelector(
        'script[data-schema="route"]'
      );
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-schema", "route");
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [fromCity, toCity, buses]);
};
