import type { MetadataRoute } from "next";
import { placeholderBooks } from "@/lib/placeholder-books";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ladybookhouse.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/books`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/cart`, lastModified: now, changeFrequency: "never", priority: 0.3 },
  ];

  const bookRoutes: MetadataRoute.Sitemap = placeholderBooks.map((book) => ({
    url: `${SITE_URL}/books/${book.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...bookRoutes];
}
