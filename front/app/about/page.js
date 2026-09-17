import qs from "qs";
import { notFound } from "next/navigation";
import ImageSlider from "@/src/components/ImageSlider/ImageSlider";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import Image from "next/image";
import BlockTitle from "@/src/components/BlockTitle/BlockTitle";
import FAQList from "@/src/components/FAQList/FAQList";
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
  const strapiData = await getData(process.env.ABOUT_URL);
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
      <ImageSlider data={strapiData}></ImageSlider>
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        components={{
          p: ({ children }) => <h2 className={styles.title}>{children}</h2>,
          strong: ({ children }) => (
            <span className={styles.strong}>{children}</span>
          ),
        }}
      >
        {strapiData.title}
      </ReactMarkdown>
      <div className={styles.charactersWrapper}>
        {strapiData.aboutCharacters.map((item) => (
          <div key={item.id} className={styles.characterCard}>
            <div className={styles.iconWrapper}>
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${item.icon.url}`}
                width={50}
                height={50}
                className={styles.icon}
                alt={item.title || "Slide #1"}
              />
            </div>
            <p className={styles.text}>{item.text}</p>
          </div>
        ))}
      </div>
      <BlockTitle
        title={strapiData.faqBlockTitle.title}
        image={strapiData.faqBlockTitle.image.url}
        className={styles.blockTitle}
        about
      />
      <FAQList data={strapiData.faqList} />
    </main>
  );
}
