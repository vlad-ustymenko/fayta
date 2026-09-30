import { notFound } from "next/navigation";
import qs from "qs";
import Feedback from "@/src/sections/Home/Feedback/Feedback";
import Image from "next/image";
import styles from "./page.module.css";
import { createMetadata } from "@/src/utils/seo";
import NewsPageAnimatedContent from "@/src/components/NewsPageAnimatedContent/NewsPageAnimatedContent";

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

async function getNews(slug) {
  const res = await fetch(
    `${process.env.STRAPI_BASE_URL}/api/news-cards?filters[slug][$eq]=${slug}&populate=*`,
    { next: { revalidate: 60 } },
  );

  if (!res.ok) throw new Error("Failed to fetch news");

  const json = await res.json();
  return json.data?.[0] ?? null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const news = await getNews(slug, "uk");
  return createMetadata({
    seo: news?.seo || null,
    path: `/news/${slug}`,
    locale: "uk",
    alternatePaths: { uk: `/news/${slug}`, en: `/en/news/${slug}` },
  });
}

export default async function NewsPage({ params }) {
  const locale = "uk";
  const { slug } = await params;
  const news = await getNews(slug);
  const feedbackData = await getHomeData();

  if (!news) notFound();

  const feedback = feedbackData?.blocks.find(
    (block) => block.__component === "blocks.feedback",
  );

  return (
    <main className={styles.main}>
      <NewsPageAnimatedContent news={news} locale={locale} />
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
      <Feedback data={feedback} className={styles.feedback} locale={locale} />
    </main>
  );
}
