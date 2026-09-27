"use client";

import React, { useLayoutEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import Image from "next/image";
import BlockTitle from "@/src/components/BlockTitle/BlockTitle";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import styles from "@/app/about/page.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function AboutAnimatedContent({ data }) {
  const titleRef = useRef(null);
  const charactersWrapperRef = useRef(null);
  const blockTitleRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      let titleSplit;
      if (titleRef.current) {
        titleSplit = new SplitText(titleRef.current, {
          type: "lines",
          linesClass: "split-line",
          mask: "lines",
        });

        gsap.set(titleSplit.lines, { yPercent: 100, opacity: 0 });

        gsap.to(titleSplit.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top bottom",
            toggleActions: "play none none none",
          },
        });
      }

      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isDesktop: "(min-width: 768px)",
        },
        (context) => {
          const isMobile = context.conditions.isMobile;

          if (!charactersWrapperRef.current) {
            return;
          }

          const cards = Array.from(
            charactersWrapperRef.current.querySelectorAll(
              `.${styles.characterCard}`,
            ),
          );

          if (isMobile) {
            cards.forEach((card) => {
              gsap.fromTo(
                card,
                { opacity: 0, x: -60 },
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.7,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    toggleActions: "play none none none",
                  },
                },
              );
            });
          } else {
            gsap.fromTo(
              cards,
              { opacity: 0, x: -60 },
              {
                opacity: 1,
                x: 0,
                duration: 0.7,
                ease: "power2.out",
                stagger: 0.15,
                scrollTrigger: {
                  trigger: charactersWrapperRef.current,
                  start: "top bottom",
                  toggleActions: "play none none none",
                },
              },
            );
          }
        },
      );

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
              trigger: blockTitleRef.current,
              start: "top bottom",
              toggleActions: "play none none none",
            },
          },
        );
      }

      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    });

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [data]);

  return (
    <>
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
      <div className={styles.charactersWrapper} ref={charactersWrapperRef}>
        {data.aboutCharacters.map((item) => (
          <div key={item.id} className={styles.characterCard}>
            <div className={styles.iconWrapper}>
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${item.icon.url}`}
                width={50}
                height={50}
                className={styles.icon}
                alt={item.title || "Slide #1"}
              />
            </div>
            <p className={styles.text}>{item.text}</p>
          </div>
        ))}
      </div>
      <div ref={blockTitleRef}>
        <BlockTitle
          title={data.faqBlockTitle.title}
          image={data.faqBlockTitle.image.url}
          className={styles.blockTitle}
          about
        />
      </div>
    </>
  );
}
