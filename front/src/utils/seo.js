const SITE_URL = "https://faytanova.com.ua";

const STRAPI_URL = process.env.STRAPI_BASE_URL;
const STRAPI_PUBLIC_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || STRAPI_URL;

export async function getSeo(path, locale = "uk") {
  if (!path) {
    return null;
  }

  const url = new URL(path, STRAPI_URL);

  url.searchParams.set("locale", locale);

  url.searchParams.set("populate[seo][populate][ogImage][fields][0]", "url");

  url.searchParams.set("populate[seo][populate][ogImage][fields][1]", "width");

  url.searchParams.set("populate[seo][populate][ogImage][fields][2]", "height");

  url.searchParams.set(
    "populate[seo][populate][ogImage][fields][3]",
    "alternativeText",
  );

  try {
    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `SEO Strapi error: ${response.status} ${response.statusText}`,
      );

      return null;
    }

    const result = await response.json();

    return result.data?.seo || null;
  } catch (error) {
    console.error("SEO Strapi request error:", error);

    return null;
  }
}

export function createMetadata({
  seo,
  path = "/",
  locale = "uk",
  alternatePaths = {},
}) {
  const title = seo?.metaTitle || "FAYTA NOVA";
  const description = seo?.metaDescription || "";

  const canonical = `${SITE_URL}${path}`;

  const ukPath = alternatePaths.uk || "/";
  const enPath = alternatePaths.en || "/en";

  const ukUrl = `${SITE_URL}${ukPath}`;
  const enUrl = `${SITE_URL}${enPath}`;

  const imageUrl = seo?.ogImage?.url
    ? `${STRAPI_PUBLIC_URL}${seo.ogImage.url}`
    : undefined;

  return {
    title,
    description,

    robots: {
      index: !seo?.noIndex,
      follow: !seo?.noIndex,
    },

    alternates: {
      canonical,

      languages: {
        uk: ukUrl,
        en: enUrl,
      },
    },

    openGraph: {
      title,
      description,
      type: "website",
      siteName: "FAYTA NOVA",
      url: canonical,

      locale: locale === "en" ? "en_US" : "uk_UA",

      alternateLocale: locale === "en" ? ["uk_UA"] : ["en_US"],

      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: seo.ogImage.width,
                height: seo.ogImage.height,
                alt: seo.ogImage.alternativeText || title,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,

      ...(imageUrl
        ? {
            images: [imageUrl],
          }
        : {}),
    },
  };
}
