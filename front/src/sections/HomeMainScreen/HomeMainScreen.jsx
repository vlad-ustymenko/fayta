import React from "react";
import Image from "next/image";
import styles from "./HomeMainScreen.module.css";

const HomeMainScreen = ({ data }) => {
  return (
    <div className={styles.main}>
      <Image
        src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data.image.url}`}
        fill
        sizes="(max-width: 768px) 100vw, (min-width: 768px) and (max-width: 1023px) 100vw, 100vw"
        alt="main image"
        style={{ objectFit: "cover" }}
        className={styles.image}
      />
      {data.title}
      <div className={styles.overlay}></div>
    </div>
  );
};

export default HomeMainScreen;
