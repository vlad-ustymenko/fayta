"use client";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";

import { useEffect, useState, useRef } from "react";
import { useSidebarContext } from "@/context/SidebarContext";
import { useLenis } from "@/context/LenisContext";
import { IoClose } from "react-icons/io5";
import Form from "../Form/Form";
import styles from "./Sidebar.module.css";

export default function Sidebar({ data }) {
  const { openSidebar, setOpenSidebar } = useSidebarContext();
  const [isMounted, setIsMounted] = useState(openSidebar);
  const lenis = useLenis();

  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (openSidebar) {
      setIsMounted(true);

      const timer = setTimeout(() => {
        const target = overlayRef.current;

        sidebarRef.current?.classList.add(styles.open);
        overlayRef.current?.classList.add(styles.openOverlay);

        if (target) {
          disableBodyScroll(target);
        }
        // ДОДАНО: зупиняємо Lenis - без цього body-scroll-lock не діє на
        // скрол, яким керує Lenis (він не спирається на overflow:hidden)
        lenis?.stop();
      }, 100);

      return () => clearTimeout(timer);
    } else {
      const target = overlayRef.current;

      sidebarRef.current?.classList.remove(styles.open);
      overlayRef.current?.classList.remove(styles.openOverlay);
      if (target) enableBodyScroll(target);
      // ДОДАНО: відновлюємо Lenis
      lenis?.start();

      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [openSidebar, lenis]);

  useEffect(() => {
    return () => {
      clearAllBodyScrollLocks();
      // ДОДАНО: підстраховка, якщо компонент розмонтується, поки сайдбар
      // ще був відкритий - Lenis не мав би лишитись "заблокованим" назавжди
      lenis?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) return null;

  return (
    <div className={styles.overlay} ref={overlayRef}>
      <aside className={`${styles.sidebar} `} ref={sidebarRef}>
        <IoClose
          className={styles.close}
          onClick={() => setOpenSidebar(false)}
        />
        <Form data={data} />
      </aside>
    </div>
  );
}
