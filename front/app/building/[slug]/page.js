import { notFound } from "next/navigation";
import qs from "qs";
import Feedback from "@/src/sections/Home/Feedback/Feedback";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import styles from "./page.module.css";
import { BiChevronsLeft } from "react-icons/bi";
import Link from "next/link";
import { getSocialIcon } from "../../../src/utils/socialIcons";
import BuildingGallery from "@/src/components/BuildingGalery/BuildingGallery";
import { getYoutubeEmbedUrl } from "@/src/utils/youtube";

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

async function getBuilding(slug) {
  const res = await fetch(
    `${process.env.STRAPI_BASE_URL}/api/building-cards?filters[slug][$eq]=${slug}&populate=*`,
    { next: { revalidate: 60 } },
  );

  if (!res.ok) throw new Error("Failed to fetch building");

  const json = await res.json();
  return json.data?.[0] ?? null;
}

export default async function BuildingPage({ params }) {
  const locale = "uk";
  const { slug } = await params;
  const building = await getBuilding(slug);
  const feedbackData = await getHomeData();

  if (!building) notFound();

  const feedback = feedbackData?.blocks.find(
    (block) => block.__component === "blocks.feedback",
  );

  const shortsEmbedUrl = getYoutubeEmbedUrl(building.youtubeLink.link, {
    controls: 0,
    loop: true,
  });

  return (
    <main className={styles.main}>
      <div className={styles.mainWrapper}>
        <div className={styles.leftBlock}>
          <Link
            href={locale === "en" ? "/en/building" : "/building"}
            className={styles.back}
          >
            <BiChevronsLeft className={styles.icon} />
            <p>{building.backText}</p>
          </Link>
          <div className={styles.titleWrapper}>
            <p className={styles.month}>{building.mounth}</p>
            <p className={styles.title}>{building.title}</p>
            <div className={styles.socialWrapper}>
              {building.socialIcons?.map((icon) => {
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
                    <Icon
                      className={
                        icon.title === "facebook" || icon.title === "telegram"
                          ? `${styles.icon} ${styles.iconfacebook}`
                          : styles.icon
                      }
                    />
                  </a>
                );
              })}
            </div>
          </div>
          <p className={styles.videoTitle}>{building.youtubeLink.title}</p>
          {shortsEmbedUrl && (
            <iframe
              className={styles.video}
              src={shortsEmbedUrl}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
        <div className={styles.rightBlock}>
          <BuildingGallery images={building.images} />
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
            {building.moreText}
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
      <Feedback data={feedback} className={styles.feedback} />
    </main>
  );
}
