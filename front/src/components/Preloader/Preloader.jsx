"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useLenis } from "@/context/LenisContext";
import styles from "./Preloader.module.css";

gsap.registerPlugin(SplitText);

const Preloader = ({ data }) => {
  const titleRef = useRef(null);
  const subTitleRef = useRef(null);
  const wrapperRef = useRef(null);

  const [isVisible, setIsVisible] = useState(true);

  const lenis = useLenis();

  useLayoutEffect(() => {
    if (!lenis) return;

    const html = document.documentElement;
    const body = document.body;

    // Запам'ятовуємо поточний стан
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyHeight = body.style.height;

    // Блокуємо Lenis
    lenis.stop();

    // Блокуємо нативний скрол
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.height = "100%";

    const ctx = gsap.context(() => {
      let titleSplit;
      let subTitleSplit;

      const tl = gsap.timeline({
        onComplete: () => {
          const fadeTl = gsap.timeline({
            onComplete: () => {
              gsap.to(wrapperRef.current, {
                yPercent: -100,
                duration: 0.01,
                onComplete: () => {
                  // Відновлюємо scroll
                  html.style.overflow = previousHtmlOverflow;
                  body.style.overflow = previousBodyOverflow;
                  body.style.height = previousBodyHeight;

                  lenis.start();

                  setIsVisible(false);
                },
              });
            },
          });

          fadeTl.to(wrapperRef.current, {
            opacity: 0,
            duration: 1,
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

        gsap.set(titleRef.current, {
          visibility: "visible",
        });

        gsap.set(titleSplit.lines, {
          yPercent: 100,
          opacity: 0,
        });

        tl.to(titleSplit.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        });
      }

      if (titleRef.current) {
        titleSplit = new SplitText(titleRef.current, {
          type: "lines",
          linesClass: "split-line",
          mask: "lines",
        });

        gsap.set(titleRef.current, {
          visibility: "visible",
        });

        gsap.set(titleSplit.lines, {
          yPercent: 100,
          opacity: 0,
        });

        tl.to(titleSplit.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 1,
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

        gsap.set(subTitleRef.current, {
          visibility: "visible",
        });

        gsap.set(subTitleSplit.lines, {
          yPercent: 100,
          opacity: 0,
        });

        tl.to(
          subTitleSplit.lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.6",
        );
      }

      return () => {
        titleSplit?.revert();
        subTitleSplit?.revert();
      };
    });

    return () => {
      ctx.revert();

      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.height = previousBodyHeight;

      lenis.start();
    };
  }, [lenis]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.main} ref={wrapperRef}>
      <div className={styles.content}>
        <h1 className={styles.title} ref={titleRef}>
          {data.title}
        </h1>

        <h2 className={styles.subTitle} ref={subTitleRef}>
          {data.subtitle}
        </h2>
      </div>
    </div>
  );
};

export default Preloader;
