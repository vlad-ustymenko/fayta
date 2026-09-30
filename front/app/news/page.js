import Link from "next/link";
import qs from "qs";
import { notFound } from "next/navigation";
import NewsCardsList from "@/src/components/NewsCardsList/NewsCardsList";
import Feedback from "@/src/sections/Home/Feedback/Feedback";
import Image from "next/image";
import { createMetadata } from "@/src/utils/seo";
import styles from "./page.module.css";

async function getHomeData() {
  const baseUrl = process.env.STRAPI_BASE_URL;

  const query = qs.stringify(
    {
      locale: "uk",
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
    const res = await fetch(url.href, { next: { revalidate: 60 } });

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

async function getData(path) {
  const baseUrl = process.env.STRAPI_BASE_URL;

  const query = qs.stringify(
    {
      locale: "uk",
      populate: {
        news_cards: {
          populate: {
            button: { populate: "*" },
            image: {
              fields: ["url"],
            },
          },
        },
        newsCategories: {
          populate: "*",
        },
        moreButton: {
          populate: {
            icon: {
              fields: ["url"],
            },
          },
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

  const url = new URL(path, baseUrl);
  url.search = query;

  try {
    const res = await fetch(url.href, { cache: "no-store" });

    if (!res.ok) {
      console.error(`Strapi error: ${res.status} ${res.statusText}`);
      return;
    }

    const data = await res.json();
    return data.data;
  } catch {}
}

export async function generateMetadata() {
  const data = await getData(process.env.NEWS_URL, "uk");

  return createMetadata({
    seo: data?.seo || null,

    path: "/news",

    locale: "uk",

    alternatePaths: {
      uk: "/news",
      en: "/en/news",
    },
  });
}

export default async function Home() {
  const strapiData = await getData(process.env.NEWS_URL);
  const feedbackData = await getHomeData();

  const feedback = feedbackData?.blocks.find(
    (block) => block.__component === "blocks.feedback",
  );

  const locale = "uk";

  if (!strapiData) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <NewsCardsList
        initialCount={strapiData.initialCount}
        backText={strapiData.backText}
        newsCategories={strapiData.newsCategories}
        cards={strapiData.news_cards}
        locale={locale}
        moreButton={strapiData.moreButton}
        className={styles.cardsWrapper}
      />

      <div className={styles.blokTitleWrapper}>
        <div className={styles.iconWrapper}>
          <Image
            src="/logo.svg"
            fill
            alt="block title icon"
            className={styles.icon}
          />
        </div>
        <span className={styles.line}></span>
      </div>
      <Feedback data={feedback} className={styles.feedback} locale={locale} />
    </main>
  );
}
