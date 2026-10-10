import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://openmis.dev";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/app/"], // Keep private workspace and local file analysis pages out of search engine indices
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
