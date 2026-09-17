"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSocialIcon } from "../../utils/socialIcons";
import { buildNavHref, getHomePath } from "@/src/utils/nav";
import styles from "./Footer.module.css";

const Footer = ({ data }) => {
  const pathname = usePathname();
  const homeHref = getHomePath(pathname);
  return (
    <div className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.leftBlock}>
          {data.leftBlock.map((item) => (
            <Link
              key={item.id}
              href={buildNavHref(item.blockID, pathname)}
              className={styles.link}
            >
              {item.title}
            </Link>
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
            <Link
              key={item.id}
              href={buildNavHref(item.blockID, pathname)}
              className={styles.link}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
      <p className={styles.socialText}>{data.socialText}</p>
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
