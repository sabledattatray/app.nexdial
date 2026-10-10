import { MetadataRoute } from "next";
import { BRAND } from "@/lib/constants/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.appName,
    short_name: BRAND.name,
    description: BRAND.description,
    start_url: "/",
    display: "standalone",
    background_color: "#090d16",
    theme_color: "#4f46e5",
    categories: ["business", "productivity", "finance", "utilities"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
