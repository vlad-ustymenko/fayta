import qs from "qs";
import { notFound } from "next/navigation";
import ImageSlider from "@/src/components/ImageSlider/ImageSlider";
import FAQList from "@/src/components/FAQList/FAQList";
import AboutAnimatedContent from "@/src/components/AboutAnimatedContent/AboutAnimatedContent";
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
        images: {
          populate: {
            image: {
              fields: ["url"],
            },
          },
        },
        aboutCharacters: {
          populate: {
            icon: {
              fields: ["url"],
            },
          },
        },
        faqBlockTitle: {
          populate: { image: { fields: ["url"] } },
        },
        faqList: {
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
  const data = await getData(process.env.ABOUT_URL, "uk");

  return createMetadata({
    seo: data?.seo || null,

    path: "/about",

    locale: "uk",

    alternatePaths: {
      uk: "/about",
      en: "/en/about",
    },
  });
}

export default async function Home() {
  const strapiData = await getData(process.env.ABOUT_URL);
  const feedbackData = await getHomeData();

  const feedback = feedbackData?.blocks.find(
    (block) => block.__component === "blocks.feedback",
  );

  if (!strapiData) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <ImageSlider data={strapiData}></ImageSlider>
      <AboutAnimatedContent data={strapiData} />
      <FAQList data={strapiData.faqList} />
    </main>
  );
}
