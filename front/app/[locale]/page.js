import qs from "qs";
import MainScreen from "@/src/sections/Home/MainScreen/MainScreen";
import { notFound } from "next/navigation";
import Concept from "@/src/sections/Home/Concept/Concept";
import Galery from "@/src/sections/Home/Galery/Galery";
import Investment from "@/src/sections/Home/Investment/Investment";
import Feedback from "@/src/sections/Home/Feedback/Feedback";
import Genplan from "@/src/sections/Home/Genplan/Genplan";
import Infrastructure from "@/src/sections/Home/Infrastructure/Infrastructure";
import Apartments from "@/src/sections/Home/Apartments/Apartments";
import TermsOfPurchase from "@/src/sections/Home/TermsOfPurchase/TermsOfPurchase";
import Documentation from "@/src/sections/Home/Documentation/Documentation";
import Building from "@/src/sections/Home/Building/Building";
import Developer from "@/src/sections/Home/Developer/Developer";
import News from "@/src/sections/Home/News/News";
import Advantages from "@/src/sections/Home/Advantages/Advantages";
import Contacts from "@/src/sections/Home/Contacts/Contacts";
import styles from "./page.module.css";
async function getData(path, locale) {
  const baseUrl = process.env.STRAPI_BASE_URL;

  const query = qs.stringify(
    {
      locale: locale,
      populate: {
        blocks: {
          on: {
            "blocks.home-main-screen": {
              fields: ["title", "subTitle"],

              populate: {
                socialIcons: {
                  populate: "*",
                },
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
            "blocks.investment": {
              populate: {
                blockTitle: { populate: { image: { fields: ["url"] } } },
                investmentList: {
                  populate: {
                    leftBlockIcon: {
                      fields: ["url"],
                    },
                  },
                },
              },
            },
            "blocks.genplan": {
              populate: {
                image: {
                  fields: ["url"],
                },
              },
            },
            "blocks.feedback": {
              populate: "*",
            },
            "blocks.infrastructure": {
              populate: {
                blockTitle: { populate: { image: { fields: ["url"] } } },
                mapCategoris: {
                  populate: {
                    places: true,
                  },
                },
                homePlace: {
                  populate: "*",
                },
              },
            },
            "blocks.terms-of-purchase": {
              populate: {
                blockTitle: { populate: { image: { fields: ["url"] } } },
                cards: {
                  populate: {
                    button: { populate: { icon: { fields: ["url"] } } },
                  },
                },
              },
            },
            "blocks.building": {
              populate: {
                blockTitle: { populate: { image: { fields: ["url"] } } },
                building_cards: {
                  populate: {
                    button: { populate: { icon: { fields: ["url"] } } },
                    images: {
                      fields: ["url"],
                    },
                  },
                },
                button: {
                  populate: {
                    icon: {
                      fields: ["url"],
                    },
                  },
                },
              },
            },

            "blocks.news": {
              populate: {
                blockTitle: { populate: { image: { fields: ["url"] } } },
                news_cards: {
                  populate: {
                    button: { populate: "*" },
                    image: {
                      fields: ["url"],
                    },
                  },
                },
                newsCategories: {
                  populate: "*",
                },
                button: {
                  populate: {
                    icon: {
                      fields: ["url"],
                    },
                  },
                },
              },
            },

            "blocks.apartment": {
              populate: {
                blockTitle: { populate: { image: { fields: ["url"] } } },
                apartment_cards: {
                  populate: {
                    apartmentCharacters: { populate: "*" },
                    image: {
                      fields: ["url"],
                    },
                  },
                },
                apartmentCategories: {
                  populate: "*",
                },
                backgroundImage: {
                  fields: ["url"],
                },
                button: {
                  populate: {
                    icon: {
                      fields: ["url"],
                    },
                  },
                },
              },
            },

            "blocks.documentation": {
              populate: {
                blockTitle: { populate: { image: { fields: ["url"] } } },
                doc: {
                  populate: "*",
                },
              },
            },
            "blocks.developer": {
              populate: {
                blockTitle: { populate: { image: { fields: ["url"] } } },
                logo: {
                  fields: ["url"],
                },
                stats: { populate: "*" },
              },
            },
            "blocks.advantages": {
              populate: {
                blockTitle: { populate: { image: { fields: ["url"] } } },
                advantagesCards: {
                  populate: {
                    image: {
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
            "blocks.contacts": {
              populate: {
                blockTitle: { populate: { image: { fields: ["url"] } } },
                contactsInfo: {
                  populate: "*",
                },
                form: {
                  populate: "*",
                },
                socialIcons: {
                  populate: "*",
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

function blockRendered(block, locale) {
  switch (block.__component) {
    case "blocks.home-main-screen":
      return <MainScreen key={block.id} data={block} />;
    case "blocks.concept":
      return <Concept key={block.id} data={block} />;
    case "blocks.galery":
      return <Galery key={block.id} data={block} />;
    case "blocks.investment":
      return <Investment key={block.id} data={block} />;
    case "blocks.genplan":
      return <Genplan key={block.id} data={block} />;
    case "blocks.feedback":
      return <Feedback key={block.id} data={block} />;
    case "blocks.infrastructure":
      return <Infrastructure key={block.id} data={block} />;
    case "blocks.terms-of-purchase":
      return <TermsOfPurchase key={block.id} data={block} />;
    case "blocks.documentation":
      return <Documentation key={block.id} data={block} />;
    case "blocks.building":
      return <Building key={block.id} data={block} locale={locale} />;
    case "blocks.developer":
      return <Developer key={block.id} data={block} />;
    case "blocks.news":
      return <News key={block.id} data={block} locale={locale} />;
    case "blocks.advantages":
      return <Advantages key={block.id} data={block} locale={locale} />;
    case "blocks.apartment":
      return <Apartments key={block.id} data={block} locale={locale} />;
    case "blocks.contacts":
      return <Contacts key={block.id} data={block} />;
  }
}

export default async function Home({ params }) {
  const { locale } = await params;
  const strapiData = await getData(process.env.HOME_URL, locale);

  if (!strapiData) {
    notFound();
  }

  const { blocks } = strapiData;
  return (
    <main className={styles.main}>
      {blocks.map((block) => blockRendered(block, locale))}
    </main>
  );
}
