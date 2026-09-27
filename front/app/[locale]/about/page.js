import qs from "qs";
import { notFound } from "next/navigation";
import ImageSlider from "@/src/components/ImageSlider/ImageSlider";
import FAQList from "@/src/components/FAQList/FAQList";
import AboutAnimatedContent from "@/src/components/AboutAnimatedContent/AboutAnimatedContent";
import styles from "./page.module.css";
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

async function getData(path, locale) {
  const baseUrl = process.env.STRAPI_BASE_URL;

  const query = qs.stringify(
    {
      locale: locale,
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

export default async function Home({ params }) {
  const { locale } = await params;
  const strapiData = await getData(process.env.ABOUT_URL, locale);
  const feedbackData = await getHomeData(locale);

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
