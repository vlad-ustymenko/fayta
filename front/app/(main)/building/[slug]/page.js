import { notFound } from "next/navigation";
import qs from "qs";
import Feedback from "@/src/sections/Home/Feedback/Feedback";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import styles from "./page.module.css";
import { BiChevronsLeft } from "react-icons/bi";
import { getSocialIcon } from "@/src/utils/socialIcons";
import BuildingGallery from "@/src/components/BuildingGalery/BuildingGallery";
import { getYoutubeEmbedUrl } from "@/src/utils/youtube";
import { createMetadata } from "@/src/utils/seo";

async function getHomeData(locale = "uk") {
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

async function getBuilding(slug, locale = "uk") {
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
  const { slug } = await params;

  const building = await getBuilding(slug, "uk");

  return createMetadata({
    seo: building?.seo || null,

    path: `/building/${slug}`,

    locale: "uk",

    alternatePaths: {
      uk: `/building/${slug}`,
      en: `/en/building/${slug}`,
    },
  });
}

export default async function BuildingPage({ params }) {
  const locale = "uk";
  const { slug } = await params;

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
      <div className={styles.mainWrapper}>
        <div className={styles.leftBlock}>
          <a
            href={locale === "en" ? "/en/building" : "/building"}
            className={styles.back}
          >
            <BiChevronsLeft className={styles.icon} />

            <p>{building.backText}</p>
          </a>

          <div className={styles.titleWrapper}>
            <p className={styles.month}>{building.mounth}</p>

            <p className={styles.title}>{building.title}</p>

            <div className={styles.socialWrapper}>
              {building.socialIcons?.map((icon) => {
                const Icon = getSocialIcon(icon.title);

                if (!Icon) {
                  return null;
                }

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
