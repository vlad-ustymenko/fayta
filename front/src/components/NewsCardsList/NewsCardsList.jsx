"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/src/components/Button/Button";
import { BiChevronsLeft } from "react-icons/bi";
import { useLenis } from "@/context/LenisContext";
import styles from "./NewsCardsList.module.css";

const INITIAL_COUNT = 3;
const STEP = 3;

const NewsCardsList = ({
  backText,
  cards,
  newsCategories,
  locale,
  moreButton,
  className,
}) => {
  const [activeCategory, setActiveCategory] = useState(newsCategories[0].slug);

  const filterCards = cards.filter((card) => card.type === activeCategory);

  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const lenis = useLenis();

  const visibleCards = filterCards.slice(0, visibleCount);
  const hasMore = visibleCount < filterCards.length;

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
      <div className={styles.titleWrapper}>
        <div className={styles.categoriesWrapper}>
          {newsCategories.map((item) => (
            <div
              className={`${styles.category} ${
                item.slug === activeCategory ? styles.active : ""
              }`}
              key={item.slug}
              href={`${locale === "en" ? "/en" : ""}/building/${item.slug}`}
              onClick={() => setActiveCategory(item.slug)}
            >
              {item.title}
            </div>
          ))}
        </div>
        <Link href={locale === "en" ? "/en" : "/"} className={styles.back}>
          <BiChevronsLeft className={styles.iconBack} />
          <p>{backText}</p>
        </Link>
      </div>

      <div className={styles.cardsWrapper}>
        {visibleCards.map((item) => (
          <Link
            className={styles.card}
            key={item.slug}
            href={`${locale === "en" ? "/en" : ""}/news/${item.slug}`}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${item.image.url}`}
                fill
                alt="main image"
                className={styles.image}
              ></Image>
            </div>

            <p className={styles.mounth}>{item.mounth}</p>

            <div className={styles.cardTitle}>{item.title}</div>
            <div className={styles.cardDescription}>{item.description}</div>
            <span className={styles.line}></span>
            <div className={styles.button}>{item.button.title}</div>
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

export default NewsCardsList;
