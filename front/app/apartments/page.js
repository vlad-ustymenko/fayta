import React from "react";
import qs from "qs";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import TermsOfPurchase from "../../src/sections/Home/TermsOfPurchase/TermsOfPurchase";
import ApartmentsRoomFilter from "@/src/components/ApartmentsRoomFilter/ApartmentsRoomFilter";
import { createMetadata } from "@/src/utils/seo";
import ApartmentsAnimatedHeader from "@/src/components/ApartmentsAnimatedHeader/ApartmentsAnimatedHeader";

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
  const data = await getData(process.env.APARTMENTS_URL, "uk");

  return createMetadata({
    seo: data?.seo || null,

    path: "/apartments",

    locale: "uk",

    alternatePaths: {
      uk: "/apartments",
      en: "/en/apartments",
    },
  });
}

export default async function Home() {
  const apartmentData = await getData(process.env.APARTMENTS_URL);
  const termsData = await getHomeData();

  if (!apartmentData) {
    console.error("APARTMENT DATA IS EMPTY");
    notFound();
  }

  const apartmentCards = apartmentData.apartment_cards || [];

  const oneRoom = apartmentCards.filter((card) => card.category === "one-room");

  const twoRoom = apartmentCards.filter((card) => card.category === "two-room");

  const threeRoom = apartmentCards.filter(
    (card) => card.category === "three-room",
  );

  const fourRoom = apartmentCards.filter(
    (card) => card.category === "four-room",
  );

  const fiveRoom = apartmentCards.filter(
    (card) => card.category === "five-room",
  );

  const locale = "uk";

  return (
    <main className={styles.main}>
      <ApartmentsAnimatedHeader
        title={apartmentData.title}
        backText={apartmentData.backText}
        locale={locale}
      />
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
      <TermsOfPurchase data={termsData.blocks[0]}></TermsOfPurchase>
    </main>
  );
}
