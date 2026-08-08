"use client";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import React from "react";
import Image from "next/image";
import { useMenuContext } from "@/context/MenuContext";
import { useLenis } from "@/context/LenisContext";
import { useRef, useState, useEffect } from "react";
import styles from "./Menu.module.css";

const Menu = ({ data }) => {
  const { activeMenu, setActiveMenu } = useMenuContext();
  const [isMounted, setIsMounted] = useState(activeMenu);
  // ДОДАНО: спільний інстанс Lenis з контексту
  const lenis = useLenis();

  const menuRef = useRef(null);

  useEffect(() => {
    if (activeMenu) {
      setIsMounted(true);

      const timer = setTimeout(() => {
        const target = menuRef.current;

        menuRef.current?.classList.add(styles.open);

        if (target) {
          disableBodyScroll(target);
        }
        // ДОДАНО: зупиняємо Lenis - той самий фікс, що й у Sidebar
        lenis?.stop();
      }, 100);

      return () => clearTimeout(timer);
    } else {
      const target = menuRef.current;

      menuRef.current?.classList.remove(styles.open);
      if (target) enableBodyScroll(target);
      lenis?.start();

      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [activeMenu, lenis]);

  useEffect(() => {
    return () => {
      clearAllBodyScrollLocks();
      // ДОДАНО: підстраховка на випадок розмонтування, поки меню відкрите
      lenis?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      <div className={styles.imageContainer}>
        <Image src="/1.png" fill alt="ew" className={styles.image}></Image>
      </div>
    </div>
  );
};

export default Menu;
