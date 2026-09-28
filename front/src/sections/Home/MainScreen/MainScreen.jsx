import React from "react";
import Image from "next/image";
import { getSocialIcon } from "../../../utils/socialIcons";
import Link from "next/link";
import styles from "./MainScreen.module.css";
const MainScreen = ({ data, locale }) => {
  const mediaUrl = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data.image.url}`;
  const isVideo = data.image.mime?.startsWith("video/");
  return (
    <div className={styles.main}>
      <div className={styles.imageWrapper}>
        {isVideo ? (
          <video
            src={mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            className={styles.image}
          />
        ) : (
          <Image
            src={mediaUrl}
            fill
            alt="main image"
            className={styles.image}
          />
        )}
      </div>
      <div className={styles.overlay}></div>
      <Link
        className={styles.buildingWrapper}
        href={`${locale === "en" ? "/en" : ""}/building/${data.building_card.slug}`}
      >
        <div className={styles.buildingImageWrapper}>
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data.building_card.images[0].url}`}
            fill
            alt="building image"
            className={styles.buildingImage}
          ></Image>
        </div>
        <p className={styles.buildingText}>{data.building_card.title}</p>
      </Link>
      <div className={styles.content}>
        <h1 className={styles.title}>{data.title}</h1>
        <h2 className={styles.subTitle}>{data.subTitle}</h2>
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
              <Icon
                className={
                  icon.title === "facebook" || icon.title === "telegram"
                    ? `${styles.icon} ${styles.iconfacebook}`
                    : styles.icon
                }
              />
            </a>
          );
        })}
      </div>
    </div>
  );
};
export default MainScreen;
