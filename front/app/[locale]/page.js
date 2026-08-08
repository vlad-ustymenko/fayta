import Image from "next/image";
import qs from "qs";
import MainScreen from "@/src/sections/Home/MainScreen/MainScreen";
import Header from "@/src/components/Header/Header";
import Sidebar from "@/src/components/Sidebar/Sidebar";
import Menu from "@/src/components/Menu/Menu";
import { notFound } from "next/navigation";
import ImageSlider from "@/src/components/ImageSlider/ImageSlider";
import Concept from "@/src/sections/Home/Concept/Concept";
import Galery from "@/src/sections/Home/Galery/Galery";
import styles from "./page.module.css";

async function getData(path, locale) {
  const baseUrl = process.env.STRAPI_BASE_URL;

  const query = qs.stringify(
    {
      locale: locale,
      populate: {
        blocks: {
          on: {
            "blocks.menu": { populate: "*" },
            "blocks.sidebar": { populate: "*" },
            "blocks.header": {
              populate: {
                menuLinks: {
                  populate: "*",
                },
                logo: {
                  fields: ["url"],
                },
              },
            },
            "blocks.home-main-screen": {
              fields: ["title", "description"],
              populate: {
                image: {
                  fields: ["url"],
                },
              },
            },
            "blocks.concept": {
              populate: {
                blockTitle: { populate: { image: { fields: ["url"] } } },
                button: {
                  populate: {
                    icon: {
                      fields: ["url"],
                    },
                  },
                },
                stats: {
                  populate: "*",
                },
                maskedImage: {
                  populate: {
                    maskImage: {
                      fields: ["url"],
                    },
                    backgroundImage: {
                      fields: ["url"],
                    },
                  },
                },
              },
            },
            "blocks.galery": {
              populate: {
                images: {
                  fields: ["url"],
                },
              },
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

function blockRendered(block, faqCategories, projectCategories) {
  switch (block.__component) {
    case "blocks.home-main-screen":
      return <MainScreen key={block.id} data={block} />;
    case "blocks.concept":
      return <Concept key={block.id} data={block} />;
    case "blocks.galery":
      return <Galery key={block.id} data={block} />;
    // case "blocks.advantages":
    //   return <Advantages key={block.id} data={block} />;
    // case "blocks.faq":
    //   return <FAQ key={block.id} data={block} categories={faqCategories} />;
    // case "blocks.news":
    //   return <News key={block.id} data={block} />;
    // case "blocks.contacts":
    //   return <Contacts key={block.id} data={block} />;
    // case "blocks.footer":
    //   return <Footer key={block.id} data={block} />;
  }
}

const slides = [
  {
    title:
      "йцуакцуепйцукепцуіпмявчапиівка йцуакцуепйцукепцуіпмявчапиівка йцуакцуепйцукепцуіпмявчапиівка",
    description: "wefwfwe",
    image: "/image.png",
  },
  { title: "werwrwerqwerqwer", description: "wefwfwe", image: "/image.png" },
  { title: "werwrwerqwerqwer", description: "wefwfwe", image: "/image.png" },
];

export default async function Home({ params }) {
  const { locale } = await params;
  const strapiData = await getData(process.env.HOME_URL, locale);

  if (!strapiData) {
    notFound();
  }

  const header = strapiData.blocks.find(
    (block) => block.__component === "blocks.header",
  );

  const sidebar = strapiData.blocks.find(
    (block) => block.__component === "blocks.sidebar",
  );

  const menu = strapiData.blocks.find(
    (block) => block.__component === "blocks.menu",
  );

  const { blocks } = strapiData;
  return (
    <>
      <Header data={header}></Header>
      <main className={styles.main}>
        {blocks.map((block) => blockRendered(block))}
        {/* <ImageSlider slides={slides}></ImageSlider> */}
        {header.menuLinks.map((item) => (
          <div key={item.id}>{item.title}</div>
        ))}
      </main>
      <Sidebar data={sidebar}></Sidebar>
      <Menu data={menu.menuLinks} />
    </>
  );
}
