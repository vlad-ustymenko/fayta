import React from "react";
import styles from "./BlockTitle.module.css";
import Image from "next/image";

const BlockTitle = ({ title, image }) => {
  return (
    <div className={styles.blokTitleWrapper}>
      <div className={styles.blokTitle}>{title}</div>
      <div className={styles.iconWrapper}>
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${image}`}
          fill
          // sizes="(max-width: 768px) 100vw, (min-width: 768px) and (max-width: 1023px) 100vw, 100vw"
          alt="block title icon"
          className={styles.icon}
        />
      </div>
      <span className={styles.line}></span>
    </div>
  );
};

export default BlockTitle;
