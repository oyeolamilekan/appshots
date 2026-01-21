import { Helmet } from "react-helmet-async";

interface SeoProps {
  title?: string;
  description?: string;
  name?: string;
  type?: string;
  url?: string;
  image?: string;
  keywords?: string[];
}

export const Seo = ({
  title,
  description,
  name = "Amaris",
  type = "website",
  url = "https://amaris.app", // Replace with actual production URL when known
  image,
  keywords = [
    "app store screenshots",
    "ios screenshot generator",
    "app store preview generator",
    "iphone mockup generator",
    "app marketing assets",
  ],
}: SeoProps) => {
  const metaTitle = title
    ? `${title} | ${name}`
    : `${name} - App Store Screenshot Generator`;
  const metaDescription =
    description ||
    "Create professional, high-converting screenshots for the Apple App Store instantly. The easiest way to generate stunning iOS app store previews without design skills.";

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}
      <link rel="canonical" href={url} />

      {/* Open Graph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={name} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter Card tags */}
      <meta name="twitter:creator" content="@amarisapp" />
      <meta
        name="twitter:card"
        content={image ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};
