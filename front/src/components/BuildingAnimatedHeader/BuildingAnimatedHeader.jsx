"use client";

import React, { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { BiChevronsLeft } from "react-icons/bi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import styles from "@/app/building/page.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function BuildingAnimatedHeader({ title, backText, locale }) {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const backRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const commonTrigger = {
        trigger: rootRef.current,
        start: "top bottom",
        toggleActions: "play none none reverse",
      };

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
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            ...commonTrigger,
            trigger: titleRef.current,
          },
        });
      }

      if (backRef.current) {
        gsap.fromTo(
          backRef.current,
          { opacity: 0, x: 60 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: backRef.current,
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
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, [title, backText, locale]);

  return (
    <div className={styles.titleWrapper} ref={rootRef}>
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
        {title}
      </ReactMarkdown>
      <Link
        href={locale === "en" ? "/en" : "/"}
        className={styles.back}
        ref={backRef}
      >
        <BiChevronsLeft className={styles.iconBack} />
        <p>{backText}</p>
      </Link>
    </div>
  );
}
