"use client";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import React from "react";
import Image from "next/image";
import MaskedMedia from "../MaskedMedia/MaskedMedia";
import { useMenuContext } from "@/context/MenuContext";
import { useRef, useState, useEffect } from "react";
import styles from "./Menu.module.css";

const Menu = ({ data }) => {
  const { activeMenu, setActiveMenu } = useMenuContext();
  const [isMounted, setIsMounted] = useState(activeMenu);

  const menuRef = useRef(null);

  console.log(data);

  useEffect(() => {
    if (activeMenu) {
      setIsMounted(true);

      const timer = setTimeout(() => {
        const target = menuRef.current;

        menuRef.current?.classList.add(styles.open);

        if (target) {
          disableBodyScroll(target);
        }
      }, 100);

      return () => clearTimeout(timer);
    } else {
      const target = menuRef.current;

      menuRef.current?.classList.remove(styles.open);
      if (target) enableBodyScroll(target);

      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [activeMenu]);

  useEffect(() => {
    return () => {
      clearAllBodyScrollLocks();
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div className={styles.menu} ref={menuRef}>
      <nav className={styles.nav}>
        {data.map((item) => (
          <a
            href={item.link}
            key={item.id}
            className={styles.link}
            onClick={() => setActiveMenu(false)}
          >
            {item.title}
          </a>
        ))}
      </nav>
      <MaskedMedia
        src="/preloader2.mp4"
        type="video" // "image" або "video", теж з CMS
        logoSrc="/logo.svg"
        width={400}
        height={400}
        alt="ew"
      ></MaskedMedia>
      <div className={styles.imageContainer}>
        <Image src="/1.png" fill alt="ew" className={styles.image}></Image>
      </div>
    </div>
  );
};

export default Menu;
