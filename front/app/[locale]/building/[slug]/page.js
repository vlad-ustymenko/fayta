import { notFound } from "next/navigation";
import qs from "qs";
import Feedback from "@/src/sections/Home/Feedback/Feedback";
import Image from "next/image";
import styles from "./page.module.css";
import { getYoutubeEmbedUrl } from "@/src/utils/youtube";
import BuildingAnimatedContent from "@/src/components/BuildingAnimatedContent/BuildingAnimatedContent";
import { createMetadata } from "@/src/utils/seo";

async function getHomeData(locale) {
  const baseUrl = process.env.STRAPI_BASE_URL;

  const query = qs.stringify(
    {
      locale,

      populate: {
        blocks: {
          on: {
            "blocks.feedback": {
              populate: "*",
            },
          },
        },
      },
    },
    { encodeValuesOnly: true },
  );

  const url = new URL(process.env.HOME_URL, baseUrl);
  url.search = query;

  try {
    const res = await fetch(url.href, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Strapi error: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();

    return data.data;
  } catch (error) {
    console.error(error);

    return null;
  }
}

async function getBuilding(slug, locale) {
  const query = qs.stringify(
    {
      locale,

      filters: {
        slug: {
          $eq: slug,
        },
      },

      populate: {
        images: {
          populate: "*",
        },

        socialIcons: {
          populate: "*",
        },

        youtubeLink: {
          populate: "*",
        },

        seo: {
          populate: {
            ogImage: {
              fields: ["url", "width", "height", "alternativeText"],
            },
          },
        },
      },
    },
    { encodeValuesOnly: true },
  );

  const url = new URL("/api/building-cards", process.env.STRAPI_BASE_URL);

  url.search = query;

  const res = await fetch(url.href, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch building");
  }

  const json = await res.json();

  return json.data?.[0] ?? null;
}

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;

  const building = await getBuilding(slug, locale);

  const isEnglish = locale === "en";

  return createMetadata({
    seo: building?.seo || null,

    path: isEnglish ? `/en/building/${slug}` : `/building/${slug}`,

    locale,

    alternatePaths: {
      uk: `/building/${slug}`,
      en: `/en/building/${slug}`,
    },
  });
}

export default async function BuildingPage({ params }) {
  const { slug, locale } = await params;

  const building = await getBuilding(slug, locale);

  const feedbackData = await getHomeData(locale);

  if (!building) {
    notFound();
  }

  const feedback = feedbackData?.blocks.find(
    (block) => block.__component === "blocks.feedback",
  );

  const shortsEmbedUrl = getYoutubeEmbedUrl(building.youtubeLink.link, {
    controls: 0,
    loop: true,
  });

  return (
    <main className={styles.main}>
      <BuildingAnimatedContent
        building={building}
        locale={locale}
        shortsEmbedUrl={shortsEmbedUrl}
      />

      <div className={styles.blokTitleWrapper}>
        <div className={styles.iconWrapper}>
          <Image
            src="/logo.svg"
            fill
            alt="block title icon"
            className={styles.blockTitleicon}
          />
        </div>

        <span className={styles.line}></span>
      </div>

      <Feedback data={feedback} />
    </main>
  );
}
