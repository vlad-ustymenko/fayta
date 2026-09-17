import { notFound } from "next/navigation";
import qs from "qs";
import Feedback from "@/src/sections/Home/Feedback/Feedback";
import Image from "next/image";

import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import styles from "./page.module.css";
import { getSocialIcon } from "../../../src/utils/socialIcons";
import { BiChevronsLeft } from "react-icons/bi";
import Link from "next/link";
import Button from "@/src/components/Button/Button";

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

export default async function NewsPage({ params }) {
  const locale = "uk";
  const { slug } = await params;
  const news = await getNews(slug);
  const feedbackData = await getHomeData();

  console.log(news.type);

  if (!news) notFound();

  const feedback = feedbackData?.blocks.find(
    (block) => block.__component === "blocks.feedback",
  );

  return (
    <main className={styles.main}>
      <div className={styles.mainWrapper}>
        <div className={styles.leftBlock}>
          <Link
            href={locale === "en" ? "/en/news" : "/news"}
            className={styles.back}
          >
            <BiChevronsLeft className={styles.icon} />
            <p>{news.backText}</p>
          </Link>
          <div className={styles.titleWrapper}>
            <div
              className={styles.monthWrapper}
              style={
                news.type === "news"
                  ? { justifyContent: "flex-end" }
                  : undefined
              }
            >
              {news.type === "offers" ? (
                <p className={styles.offer}>{news.typeName}</p>
              ) : (
                ""
              )}
              {news.type === "news" ? (
                <p className={styles.month}>{news.month}</p>
              ) : (
                ""
              )}
            </div>
            <p className={styles.title}>{news.title}</p>
            <div
              className={styles.socialContent}
              style={
                news.type === "news"
                  ? { justifyContent: "flex-end" }
                  : undefined
              }
            >
              {news.type === "offers" ? (
                <Button title={news.dateBy} small></Button>
              ) : (
                ""
              )}
              <div className={styles.socialWrapper}>
                {news.socialIcons?.map((icon) => {
                  const Icon = getSocialIcon(icon.title);
                  if (!Icon) return null;

                  return (
                    <a
                      key={icon.id}
                      href={icon.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      <Icon className={styles.icon} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.rightBlock}>
          {/* <BuildingGallery images={building.images} /> */}
          <ReactMarkdown
            remarkPlugins={[remarkBreaks]}
            components={{
              p: ({ children }) => (
                <p className={styles.moreText}>{children}</p>
              ),
              strong: ({ children }) => (
                <span className={styles.strong}>{children}</span>
              ),
              li: ({ children }) => (
                <li className={styles.listItem}>{children}</li>
              ),
            }}
          >
            {news.descriptionMore}
          </ReactMarkdown>
        </div>
      </div>
      <div className={styles.blokTitleWrapper}>
        <div className={styles.iconWrapper}>
          <Image
            src="/logo.svg"
            fill
            // sizes="(max-width: 768px) 100vw, (min-width: 768px) and (max-width: 1023px) 100vw, 100vw"
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
