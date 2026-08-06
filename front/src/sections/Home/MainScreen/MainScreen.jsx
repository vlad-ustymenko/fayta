import React from "react";
import Image from "next/image";
import styles from "./MainScreen.module.css";

const MainScreen = ({ data }) => {
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

      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>Fayta nova</h1>
        <h1 className={styles.description}>
          Cучасний житловий квартал у передмісті Ужгорода, створений для тих,
          хто обирає життя у форматі затишку, спокою та щоденного комфорту.
        </h1>
      </div>
    </div>
  );
};

export default MainScreen;
