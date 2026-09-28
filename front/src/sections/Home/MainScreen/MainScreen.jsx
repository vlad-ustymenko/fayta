import React from "react";
import Image from "next/image";
import { getSocialIcon } from "../../../utils/socialIcons";
import styles from "./MainScreen.module.css";
const MainScreen = ({ data }) => {
  const mediaUrl = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data.image.url}`;
  const isVideo = data.image.mime?.startsWith("video/");
  console.log(data);
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
            style={{ objectFit: "cover" }}
            className={styles.image}
          />
        )}
      </div>
      <div className={styles.overlay}></div>
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
