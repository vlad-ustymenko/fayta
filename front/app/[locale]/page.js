import Image from "next/image";
import qs from "qs";
import HomeMainScreen from "@/src/sections/HomeMainScreen/HomeMainScreen";
import Header from "@/src/components/Header/Header";
import Sidebar from "@/src/components/Sidebar/Sidebar";
import styles from "./page.module.css";

async function getData(path, locale) {
  const baseUrl = process.env.STRAPI_BASE_URL;

  const query = qs.stringify(
    {
      locale: locale,
      populate: {
        blocks: {
          on: {
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
      return <HomeMainScreen key={block.id} data={block} />;
    // case "blocks.about":
    //   return <About key={block.id} data={block} />;
    // case "blocks.developer":
    //   return <Developer key={block.id} data={block} />;
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

export default async function Home({ params }) {
  const { locale } = await params;
  const strapiData = await getData(process.env.HOME_URL, locale);
  const header = strapiData.blocks.find(
    (block) => block.__component === "blocks.header",
  );

  const sidebar = strapiData.blocks.find(
    (block) => block.__component === "blocks.sidebar",
  );

  if (!strapiData) {
    notFound();
  }

  const { blocks } = strapiData;
  return (
    <>
      <Header data={header}></Header>
      <main>
        {blocks.map((block) => blockRendered(block))}
        {header.menuLinks.map((item) => (
          <div key={item.id}>{item.title}</div>
        ))}
      </main>
      <Sidebar data={sidebar}></Sidebar>
    </>
  );
}
