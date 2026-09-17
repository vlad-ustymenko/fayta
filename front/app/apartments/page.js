import React from "react";
import Link from "next/link";
import qs from "qs";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { BiChevronsLeft } from "react-icons/bi";
import styles from "./page.module.css";
import TermsOfPurchase from "../../src/sections/Home/TermsOfPurchase/TermsOfPurchase";
import ApartmentsRoomFilter from "@/src/components/ApartmentsRoomFilter/ApartmentsRoomFilter";

async function getHomeData() {
  const baseUrl = process.env.STRAPI_BASE_URL;

  const query = qs.stringify(
    {
      locale: "uk",
      populate: {
        blocks: {
          on: {
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
        apartment_cards: {
          populate: {
            apartmentCharacters: { populate: "*" },
            image: {
              fields: ["url"],
            },
          },
        },
        apartmentCategories: { populate: "*" },
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
  const apartmentData = await getData(process.env.APARTMENTS_URL);
  const termsData = await getHomeData();

  const oneRoom = apartmentData.apartment_cards.filter(
    (card) => card.category === "one-room",
  );

  console.log(oneRoom);

  const twoRoom = apartmentData.apartment_cards.filter(
    (card) => card.category === "two-room",
  );
  const threeRoom = apartmentData.apartment_cards.filter(
    (card) => card.category === "three-room",
  );
  const fourRoom = apartmentData.apartment_cards.filter(
    (card) => card.category === "four-room",
  );
  const fiveRoom = apartmentData.apartment_cards.filter(
    (card) => card.category === "five-room",
  );

  const terms = termsData?.blocks.find(
    (block) => block.__component === "blocks.terms-of-purchase",
  );

  const locale = "uk";

  if (!apartmentData) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <div className={styles.titleWrapper}>
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          components={{
            p: ({ children }) => <h2 className={styles.title}>{children}</h2>,
            strong: ({ children }) => (
              <span className={styles.strong}>{children}</span>
            ),
          }}
        >
          {apartmentData.title}
        </ReactMarkdown>
        <Link href={locale === "en" ? "/en" : "/"} className={styles.back}>
          <BiChevronsLeft className={styles.iconBack} />
          <p>{apartmentData.backText}</p>
        </Link>
      </div>
      {oneRoom.length > 0 && (
        <ApartmentsRoomFilter
          data={oneRoom}
          apartmentCategories={apartmentData.apartmentCategories}
        />
      )}
      {twoRoom.length > 0 && (
        <ApartmentsRoomFilter
          data={twoRoom}
          apartmentCategories={apartmentData.apartmentCategories}
        />
      )}
      {threeRoom.length > 0 && (
        <ApartmentsRoomFilter
          data={threeRoom}
          apartmentCategories={apartmentData.apartmentCategories}
        />
      )}
      {fourRoom.length > 0 && (
        <ApartmentsRoomFilter
          data={fourRoom}
          apartmentCategories={apartmentData.apartmentCategories}
        />
      )}
      {fiveRoom.length > 0 && (
        <ApartmentsRoomFilter
          data={fiveRoom}
          apartmentCategories={apartmentData.apartmentCategories}
        />
      )}
      {apartmentData.flatShow && (
        <div className={styles.flatShow}>flatShow</div>
      )}
      <TermsOfPurchase data={terms}></TermsOfPurchase>
    </main>
  );
}
