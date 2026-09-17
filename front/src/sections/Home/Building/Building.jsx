import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import React from "react";
import Button from "../../../components/Button/Button";
import Image from "next/image";
import Link from "next/link";
import styles from "./Building.module.css";

const Building = ({ data, locale }) => {
  return (
    <div className={styles.building}>
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
          className={styles.buttonMore}
          title={data.button.title}
          link
          href={`${locale === "en" ? "/en" : ""}${data.button.href}`}
          icon={data.button.icon.url}
          small
        ></Button>
      </div>
      <div className={styles.cardsWrapper}>
        {data.building_cards.slice(0, 3).map((item) => (
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
              ></Image>
            </div>
            <div className={styles.mounthWrapper}>
              <Button
                className={styles.button}
                title={item.button.title}
                icon={item.button.icon.url}
                small
              ></Button>
              <p className={styles.mounth}>{item.mounth}</p>
            </div>
            <div className={styles.cardTitle}>{item.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Building;
