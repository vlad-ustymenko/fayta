import React from "react";
import Image from "next/image";
import { AiFillInstagram } from "react-icons/ai";
import { IoLogoYoutube } from "react-icons/io";
import { BsFacebook } from "react-icons/bs";
import { AiFillFacebook } from "react-icons/ai";
import { AiFillYoutube } from "react-icons/ai";
import { BsYoutube } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";
import { FaFacebookSquare } from "react-icons/fa";
import { BiLogoInstagramAlt } from "react-icons/bi";
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
        <h1 className={styles.title}>{data.title}</h1>
        <h1 className={styles.description}>{data.description}</h1>
      </div>
      <div className={styles.socialWrapper}>
        <a href="#" target="_blank" className={styles.socialLink}>
          <AiFillInstagram className={styles.icon} />
        </a>
        <a href="#" target="_blank" className={styles.socialLink}>
          <AiFillYoutube className={styles.icon} />
        </a>
        <a href="#" target="_blank" className={styles.socialLink}>
          <BsFacebook className={styles.iconfacebook} />
        </a>
      </div>
    </div>
  );
};

export default MainScreen;
