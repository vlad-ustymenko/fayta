import { notFound } from "next/navigation";
import qs from "qs";
import Feedback from "@/src/sections/Home/Feedback/Feedback";
import Image from "next/image";
import styles from "./page.module.css";
import { createMetadata } from "@/src/utils/seo";
import NewsPageAnimatedContent from "@/src/components/NewsPageAnimatedContent/NewsPageAnimatedContent";

async function getHomeData(locale) {
  const baseUrl = process.env.STRAPI_BASE_URL;

  const query = qs.stringify(
    {
      locale: locale,
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

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const news = await getNews(slug, locale);
  const isEnglish = locale === "en";
  return createMetadata({
    seo: news?.seo || null,
    path: isEnglish ? `/en/news/${slug}` : `/news/${slug}`,
    locale,
    alternatePaths: { uk: `/news/${slug}`, en: `/en/news/${slug}` },
  });
}

async function getNews(slug, locale) {
  const res = await fetch(
    `${process.env.STRAPI_BASE_URL}/api/news-cards?filters[slug][$eq]=${slug}&locale=${locale}&populate=*`,
    { next: { revalidate: 60 } },
  );

  if (!res.ok) throw new Error("Failed to fetch news");

  const json = await res.json();
  return json.data?.[0] ?? null;
}

export default async function NewsPage({ params }) {
  const { slug, locale } = await params;
  const news = await getNews(slug, locale);
  const feedbackData = await getHomeData(locale);

  console.log(news);

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
      <Feedback data={feedback} locale={locale} />
    </main>
  );
}
