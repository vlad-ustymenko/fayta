import React from "react";
import Image from "next/image";
import styles from "./Genplan.module.css";

const Genplan = ({ data }) => {
  return (
    <div className={styles.genplan} id="genplan">
      <Image
        src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data.image.url}`}
        fill
        // sizes="(max-width: 768px) 100vw, (min-width: 768px) and (max-width: 1023px) 100vw, 100vw"
        alt="main image"
        style={{ objectFit: "cover" }}
        className={styles.image}
      />
    </div>
  );
};

export default Genplan;
