"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useLenis } from "@/context/LenisContext";
import styles from "./Preloader.module.css";

gsap.registerPlugin(SplitText);

const Preloader = () => {
  const titleRef = useRef(null);
  const subTitleRef = useRef(null);
  const wrapperRef = useRef(null);

  const [isVisible, setIsVisible] = useState(true);

  const lenis = useLenis();

  useLayoutEffect(() => {
    // Блокуємо скрол на час анімації
    lenis?.stop();
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      let titleSplit;
      let subTitleSplit;

      const tl = gsap.timeline({
        onComplete: () => {
          // Анімація тексту завершена — чекаємо трохи і починаємо зникнення
          const fadeTl = gsap.timeline({
            onComplete: () => {
              // opacity дійшло до 0 — тепер різко ховаємо вгору
              gsap.to(wrapperRef.current, {
                yPercent: -100,
                duration: 0.01,
                onComplete: () => {
                  // Розблоковуємо скрол і прибираємо компонент з DOM
                  document.body.style.overflow = "";
                  lenis?.start();
                  setIsVisible(false);
                },
              });
            },
          });

          fadeTl.to(wrapperRef.current, {
            opacity: 0,
            duration: 1.5,
            ease: "power2.out",
            delay: 0.3,
          });
        },
      });

      if (titleRef.current) {
        titleSplit = new SplitText(titleRef.current, {
          type: "lines",
          linesClass: "split-line",
          mask: "lines",
        });

        gsap.set(titleSplit.lines, { yPercent: 100, opacity: 0 });

        tl.to(titleSplit.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.1,
          ease: "power3.out",
        });
      }

      if (subTitleRef.current) {
        subTitleSplit = new SplitText(subTitleRef.current, {
          type: "lines",
          linesClass: "split-line",
          mask: "lines",
        });

        gsap.set(subTitleSplit.lines, { yPercent: 100, opacity: 0 });

        tl.to(
          subTitleSplit.lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.5,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.6",
        );
      }

      return () => {
        if (titleSplit) {
          titleSplit.revert();
        }
        if (subTitleSplit) {
          subTitleSplit.revert();
        }
      };
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [lenis]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.main} ref={wrapperRef}>
      <div className={styles.content}>
        <h1 className={styles.title} ref={titleRef}>
          FAYTA NOVA
        </h1>
        <h2 className={styles.subTitle} ref={subTitleRef}>
          cвій квартал
        </h2>
      </div>
    </div>
  );
};

export default Preloader;
