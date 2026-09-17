"use client";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import React from "react";
import Button from "../../../components/Button/Button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./News.module.css";

const News = ({ data, locale }) => {
  const [activeCategory, setActiveCategory] = useState(
    data.newsCategories[0].slug,
  );

  const filterCards = data.news_cards.filter(
    (card) => card.type === activeCategory,
  );

  return (
    <div className={styles.news} id="news">
      <BlockTitle
        title={data.blockTitle.title}
        image={data.blockTitle.image.url}
      />
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
          {data.title}
        </ReactMarkdown>
        <Button
          className={styles.button}
          title={data.button.title}
          link
          href={`${locale === "en" ? "/en" : ""}${data.button.href}`}
          icon={data.button.icon.url}
          small
        ></Button>
      </div>
      <div className={styles.categoriesWrapper}>
        {data.newsCategories.map((item) => (
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
      <div className={styles.cardsWrapper}>
        {filterCards.slice(0, 3).map((item) => (
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

            <p className={styles.cardTitle}>{item.title}</p>
            <p className={styles.cardDescription}>{item.description}</p>
            <span className={styles.line}></span>
            <div className={styles.button}>{item.button.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default News;
