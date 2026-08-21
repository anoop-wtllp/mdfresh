import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

/**
 * Six static routes, listed by hand because there is no CMS to enumerate.
 * `priority` ranks them against each other only — Home, then the two pages a
 * buyer actually converts on.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<[string, number]> = [
    ["", 1],
    ["/products", 0.9],
    ["/contact", 0.9],
    ["/about", 0.8],
    ["/process", 0.8],
    ["/markets", 0.8],
  ];

  return routes.map(([path, priority]) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
