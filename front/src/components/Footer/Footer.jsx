import React from "react";
import Image from "next/image";
import { AiFillInstagram } from "react-icons/ai";
import { BsFacebook } from "react-icons/bs";
import { AiFillYoutube } from "react-icons/ai";
import styles from "./Footer.module.css";

const Footer = ({ data }) => {
  const { instaLink, fbLink, youtubeLink } = data.socialLinks;
  return (
    <div className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.leftBlock}>
          {data.leftBlock.map((item) => (
            <a href={item.link} className={styles.link} key={item.id}>
              {item.title}
            </a>
          ))}
        </div>
        <div className={styles.iconWrapper}>
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data.icon.url}`}
            alt="logo"
            fill
            className={styles.logo}
          ></Image>
        </div>
        <div className={styles.rightBlock}>
          {data.rightBlock.map((item) => (
            <a href={item.link} className={styles.link} key={item.id}>
              {item.title}
            </a>
          ))}
        </div>
      </div>
      <p className={styles.socialText}>{data.socialText}</p>
      <div className={styles.socialWrapper}>
        <a href={instaLink} target="_blank" className={styles.socialLink}>
          <AiFillInstagram className={styles.icon} />
        </a>
        <a href={youtubeLink} target="_blank" className={styles.socialLink}>
          <AiFillYoutube className={styles.icon} />
        </a>
        <a href={fbLink} target="_blank" className={styles.socialLink}>
          <BsFacebook className={styles.iconfacebook} />
        </a>
      </div>
      <div className={styles.line}></div>
      <div className={styles.copyrightWrapper}>
        <p className={styles.copyright}>{data.copyright}</p>
        <a href={data.policy.link} className={styles.policy}>
          {data.policy.title}
        </a>
      </div>
    </div>
  );
};

export default Footer;
