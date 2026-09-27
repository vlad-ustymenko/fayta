import qs from "qs";
import { notFound } from "next/navigation";
import BuildingCardsList from "@/src/components/BuildingCardsList/BuildingCardsList";
import Feedback from "@/src/sections/Home/Feedback/Feedback";
import Image from "next/image";
import BuildingAnimatedHeader from "@/src/components/BuildingAnimatedHeader/BuildingAnimatedHeader";
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
        building_cards: {
          populate: {
            button: { populate: { icon: { fields: ["url"] } } },
            images: {
              fields: ["url"],
            },
          },
        },
        moreButton: {
          populate: {
            icon: {
              fields: ["url"],
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

export default async function Home() {
  const strapiData = await getData(process.env.BUILDING_URL);
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
      <BuildingAnimatedHeader
        title={strapiData.title}
        backText={strapiData.backText}
        locale={locale}
      />

      <BuildingCardsList
        initialCount={strapiData.initialCount}
        cards={strapiData.building_cards}
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
      <Feedback data={feedback} className={styles.feedback} />
    </main>
  );
}
