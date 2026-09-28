"use client";

import React, { useLayoutEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import { AiFillEye } from "react-icons/ai";
import styles from "./Documentation.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Documentation = ({ data }) => {
  const rootRef = useRef(null);
  const blockTitleRef = useRef(null);
  const titleRef = useRef(null);
  const docGridRef = useRef(null);

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

      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isDesktop: "(min-width: 768px)",
        },
        (context) => {
          const { isMobile } = context.conditions;

          if (!docGridRef.current) return;

          const items = Array.from(
            docGridRef.current.querySelectorAll(`.${styles.docItemWrapper}`),
          );

          if (isMobile) {
            items.forEach((item) => {
              gsap.fromTo(
                item,
                { opacity: 0, x: -60 },
                {
                  opacity: 1,
                  x: 0,
                  duration: 1,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: item,
                    start: "top bottom",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            });
          } else {
            gsap.fromTo(
              items,
              { opacity: 0, x: -60 },
              {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "power2.out",
                stagger: 0.15,
                scrollTrigger: {
                  ...commonTrigger,
                  trigger: docGridRef.current,
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
    <div className={styles.documentation} ref={rootRef}>
      <div ref={blockTitleRef}>
        <BlockTitle
          title={data.blockTitle.title}
          image={data.blockTitle.image.url}
        />
      </div>
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

      <div className={styles.docGrid} ref={docGridRef}>
        {data.doc.map((item) => (
          <div key={item.title} className={styles.docItemWrapper}>
            <div className={styles.docItemInner}>
              <div className={styles.docItemText}>{item.title}</div>
              <AiFillEye className={styles.icon} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documentation;
