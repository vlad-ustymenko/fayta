import React from "react";
import styles from "./BlockTitle.module.css";
import Image from "next/image";

const BlockTitle = ({ title, image, className, local }) => {
  return (
    <div className={styles.blokTitleWrapper + " " + className}>
      <div className={styles.blokTitle}>{title}</div>
      <div className={styles.iconWrapper}>
        <Image
          src={
            local ? image : `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${image}`
          }
          fill
          // sizes="(max-width: 768px) 100vw, (min-width: 768px) and (max-width: 1023px) 100vw, 100vw"
          alt="block title icon"
          className={styles.icon}
        />
      </div>
      <div className={styles.line}></div>
    </div>
  );
};

export default BlockTitle;
