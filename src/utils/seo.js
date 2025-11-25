/**
 * SEO utility functions for dynamic metadata management
 */

export const updatePageTitle = (title) => {
  if (typeof document !== "undefined") {
    document.title = title;
  }
};

export const updateMetaDescription = (description) => {
  if (typeof document !== "undefined") {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = description;
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }
  }
};

export const updateOpenGraphTags = (title, description, url) => {
  if (typeof document !== "undefined") {
    // Update OG title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.content = title;
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:title");
      meta.content = title;
      document.head.appendChild(meta);
    }

    // Update OG description
    let ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    if (ogDescription) {
      ogDescription.content = description;
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:description");
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Update OG URL
    if (url) {
      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) {
        ogUrl.content = url;
      } else {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:url");
        meta.content = url;
        document.head.appendChild(meta);
      }
    }
  }
};

export const updateCanonicalUrl = (url) => {
  if (typeof document !== "undefined") {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.href = url;
    } else {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = url;
      document.head.appendChild(link);
    }
  }
};

export const updateRobotsTag = (content) => {
  if (typeof document !== "undefined") {
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (robotsMeta) {
      robotsMeta.content = content;
    } else {
      const meta = document.createElement("meta");
      meta.name = "robots";
      meta.content = content;
      document.head.appendChild(meta);
    }
  }
};
