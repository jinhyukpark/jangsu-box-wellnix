import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
}

export function SEO({ title, description, image }: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = `${title} | 웰닉스`;

    // Update meta tags
    const updateMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        if (name.startsWith("og:")) {
          element.setAttribute("property", name);
        } else {
          element.setAttribute("name", name);
        }
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    if (description) {
      updateMeta("description", description);
      updateMeta("og:description", description);
      updateMeta("twitter:description", description);
    }

    updateMeta("og:title", title);
    updateMeta("twitter:title", title);

    if (image) {
      updateMeta("og:image", image);
      updateMeta("twitter:image", image);
    } else {
      // Default image if not provided
      updateMeta("og:image", "/attached_assets/generated_images/premium_korean_health_gift_box.png");
      updateMeta("twitter:image", "/attached_assets/generated_images/premium_korean_health_gift_box.png");
    }

    // Cleanup function not strictly necessary for single page transitions where we always overwrite,
    // but good practice if we wanted to revert to a default state.
    // For this mockup, overwriting is fine.

  }, [title, description, image]);

  return null;
}