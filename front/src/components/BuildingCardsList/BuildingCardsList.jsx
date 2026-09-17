"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/src/components/Button/Button";
import { useLenis } from "@/context/LenisContext";
import styles from "./BuildingCardsList.module.css";

const INITIAL_COUNT = 6;
const STEP = 3;

const BuildingCardsList = ({ cards, locale, moreButton, className }) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const lenis = useLenis();

  const visibleCards = cards.slice(0, visibleCount);
  const hasMore = visibleCount < cards.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + STEP, cards.length));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lenis?.resize();
      });
    });
  };

  return (
    <>
      <div className={`${styles.cardsWrapper} ${className}`}>
        {visibleCards.map((item) => (
          <Link
            className={styles.card}
            key={item.slug}
            href={`${locale === "en" ? "/en" : ""}/building/${item.slug}`}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${item.images[0].url}`}
                fill
                alt="main image"
                className={styles.image}
              />
            </div>
            <div className={styles.mounthWrapper}>
              <Button
                className={styles.button}
                title={item.button.title}
                icon={item.button.icon.url}
                small
              />
              <p className={styles.mounth}>{item.mounth}</p>
            </div>
            <div className={styles.cardTitle}>{item.title}</div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <Button
          className={styles.loadMoreButton}
          onClick={handleLoadMore}
          title={moreButton.title}
          icon={moreButton.icon.url}
          small
        ></Button>
      )}
    </>
  );
};

export default BuildingCardsList;
