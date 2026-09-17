"use client";
import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "@/context/LenisContext";
import { getHomePath } from "@/src/utils/nav";

const ScrollToHash = () => {
  const pathname = usePathname();
  const lenis = useLenis();

  const resizeLenis = useCallback(() => {
    if (!lenis) return;

    const doResize = () => lenis.resize();

    if (document.readyState === "complete") {
      setTimeout(doResize, 200);
    } else {
      window.addEventListener("load", () => setTimeout(doResize, 200), {
        once: true,
      });
    }
  }, [lenis]);

  const scrollToCurrentHash = useCallback(() => {
    const homePath = getHomePath(pathname);
    const hash = window.location.hash;

    // якщо хеша немає — скидаємо скрол на початок сторінки
    if (!hash) {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
      return;
    }

    if (pathname !== homePath) return;
    if (!lenis) return;

    const doScroll = () => {
      const target = document.querySelector(hash);
      if (target) {
        lenis.resize();
        lenis.scrollTo(target, { offset: 0, immediate: false });
      }
    };

    if (document.readyState === "complete") {
      setTimeout(doScroll, 200);
    } else {
      window.addEventListener("load", () => setTimeout(doScroll, 200), {
        once: true,
      });
    }
  }, [pathname, lenis]);

  useEffect(() => {
    resizeLenis();
  }, [pathname, resizeLenis]);

  useEffect(() => {
    scrollToCurrentHash();
  }, [scrollToCurrentHash]);

  useEffect(() => {
    window.addEventListener("hashchange", scrollToCurrentHash);
    return () => window.removeEventListener("hashchange", scrollToCurrentHash);
  }, [scrollToCurrentHash]);

  return null;
};

export default ScrollToHash;
