import type { MetadataRoute } from "next";

import { solutions } from "@/lib/pseo-data";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/loesungen`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const solutionRoutes: MetadataRoute.Sitemap = solutions.map((solution) => ({
    url: `${siteUrl}/loesungen/${solution.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...solutionRoutes];
}
