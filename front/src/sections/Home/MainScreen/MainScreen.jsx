import React from "react";
import Image from "next/image";
import { getSocialIcon } from "../../../utils/socialIcons";

import styles from "./MainScreen.module.css";

const MainScreen = ({ data }) => {
  return (
    <div className={styles.main}>
      <div className={styles.imageWrapper}>
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data.image.url}`}
          fill
          // sizes="(max-width: 768px) 100vw, (min-width: 768px) and (max-width: 1023px) 100vw, 100vw"
          alt="main image"
          style={{ objectFit: "cover" }}
          className={styles.image}
        />
      </div>

      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h2 className={styles.subTitle}>{data.subTitle}</h2>
        <h1 className={styles.title}>{data.title}</h1>
      </div>
      <div className={styles.socialWrapper}>
        {data.socialIcons?.map((icon) => {
          const Icon = getSocialIcon(icon.title);
          if (!Icon) return null;

          return (
            <a
              key={icon.id}
              href={icon.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <Icon className={styles.icon} />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default MainScreen;
