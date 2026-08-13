import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

const BRAND_TITLE = "Arroweye Pro | AI-Powered Insights for African Creators";
const BRAND_DESCRIPTION =
  "Track expenses, generate reports and leverage key insights to boost your ROI.";
const OG_IMAGE = "https://studio.arroweye.pro/banner.png";

export const metadata: Metadata = {
  title: BRAND_TITLE,
  description: BRAND_DESCRIPTION,
  openGraph: {
    type: "website",
    url: "https://studio.arroweye.pro/",
    title: BRAND_TITLE,
    description: BRAND_DESCRIPTION,
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_TITLE,
    description: BRAND_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
