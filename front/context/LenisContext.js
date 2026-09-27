// context/LenisContext.jsx
"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext(null);

export function LenisProvider({ children }) {
  const [lenis, setLenis] = useState(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    const instance = new Lenis({
      autoRaf: false,
    });
    lenisRef.current = instance;
    setLenis(instance);

    // --- Стандартна інтеграція Lenis + ScrollTrigger ---

    // 1. ScrollTrigger дізнається про кожен тік скролу від Lenis
    instance.on("scroll", ScrollTrigger.update);

    // 2. GSAP керує рушієм анімації замість власного requestAnimationFrame
    const tickerCallback = (time) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // 3. КЛЮЧОВИЙ РЯДОК: коли ScrollTrigger перераховує позиції
    // (наприклад, після появи pin-spacer), Lenis МАЄ перерахувати
    // власні внутрішні ліміти скролу — інакше Lenis продовжує
    // вважати, що документ має стару (меншу) висоту.
    const handleRefresh = () => instance.resize();
    ScrollTrigger.addEventListener("refresh", handleRefresh);

    // Рефреш після повного завантаження сторінки
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("load", handleLoad);

    if (document.readyState === "complete") {
      ScrollTrigger.refresh();
    }

    // Рефреш при зміні висоти документа (лениві картинки, pin і т.д.)
    let refreshTimeout;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    });
    resizeObserver.observe(document.body);

    // Початковий рефреш, щоб усе одразу порахувалось коректно
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("load", handleLoad);
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
      clearTimeout(refreshTimeout);
      resizeObserver.disconnect();
      gsap.ticker.remove(tickerCallback);
      instance.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}

export function useLenis() {
  return useContext(LenisContext);
}
