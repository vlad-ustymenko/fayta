"use client";

import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import React, { useLayoutEffect, useRef } from "react";
import Button from "../../../components/Button/Button";
import Image from "next/image";
import styles from "./Building.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Building = ({ data, locale }) => {
  const rootRef = useRef(null);
  const blockTitleRef = useRef(null);
  const titleRef = useRef(null);
  const buttonMoreRef = useRef(null);
  const cardsWrapperRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const commonTrigger = {
        trigger: rootRef.current,
        start: "top bottom",
        toggleActions: "play none none reverse",
      };

      // 1. BlockTitle — зліва направо + opacity
      if (blockTitleRef.current) {
        gsap.fromTo(
          blockTitleRef.current,
          { opacity: 0, x: -80 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: blockTitleRef.current,
            },
          },
        );
      }

      let titleSplit;
      if (titleRef.current) {
        titleSplit = new SplitText(titleRef.current, {
          type: "lines",
          linesClass: "split-line",
          mask: "lines",
        });

        gsap.set(titleSplit.lines, {
          yPercent: 100,
          opacity: 0,
        });

        gsap.to(titleSplit.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            ...commonTrigger,
            trigger: titleRef.current,
          },
        });
      }

      // 3. buttonMore — справа наліво + opacity
      if (buttonMoreRef.current) {
        gsap.fromTo(
          buttonMoreRef.current,
          { opacity: 0, x: 80 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: buttonMoreRef.current,
            },
          },
        );
      }

      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isDesktop: "(min-width: 768px)",
        },
        (context) => {
          const { isMobile } = context.conditions;

          if (!cardsWrapperRef.current) return;

          const cardItems = Array.from(
            cardsWrapperRef.current.querySelectorAll(`.${styles.card}`),
          );

          if (isMobile) {
            cardItems.forEach((card) => {
              gsap.fromTo(
                card,
                { opacity: 0, x: -60 },
                {
                  opacity: 1,
                  x: 0,
                  duration: 1,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            });
          } else {
            gsap.fromTo(
              cardItems,
              { opacity: 0, x: -60 },
              {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "power2.out",
                stagger: 0.15,
                scrollTrigger: {
                  ...commonTrigger,
                  trigger: cardsWrapperRef.current,
                },
              },
            );
          }
        },
      );

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, rootRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [data]);

  return (
    <div className={styles.building} ref={rootRef}>
      <div ref={blockTitleRef}>
        <BlockTitle
          title={data.blockTitle.title}
          image={data.blockTitle.image.url}
        />
      </div>
      <div className={styles.titleWrapper}>
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          components={{
            p: ({ children }) => (
              <h2 className={styles.title} ref={titleRef}>
                {children}
              </h2>
            ),
            strong: ({ children }) => (
              <span className={styles.strong}>{children}</span>
            ),
          }}
        >
          {data.title}
        </ReactMarkdown>
        <div ref={buttonMoreRef} className={styles.buttonMore}>
          <Button
            title={data.button.title}
            link
            href={`${locale === "en" ? "/en" : ""}${data.button.href}`}
            icon={data.button.icon.url}
            small
          ></Button>
        </div>
      </div>
      <div className={styles.cardsWrapper} ref={cardsWrapperRef}>
        {data.building_cards.slice(0, 3).map((item) => (
          <a
            className={styles.card}
            key={item.slug}
            href={`${locale === "en" ? "/en" : ""}/building/${item.slug}`}
          >
            <div className={styles.cardInner}>
              <div className={styles.imageWrapper}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${item.images[0].url}`}
                  fill
                  alt="main image"
                  className={styles.image}
                ></Image>
              </div>
              <div className={styles.mounthWrapper}>
                <Button
                  className={styles.button}
                  title={item.button.title}
                  icon={item.button.icon.url}
                  small
                ></Button>
                <p className={styles.mounth}>{item.mounth}</p>
              </div>
              <div className={styles.cardTitle}>{item.title}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Building;
