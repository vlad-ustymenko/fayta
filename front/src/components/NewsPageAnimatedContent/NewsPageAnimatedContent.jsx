// src/components/NewsPageAnimatedContent/NewsPageAnimatedContent.jsx
"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { BiChevronsLeft } from "react-icons/bi";
import Button from "@/src/components/Button/Button";
import { getSocialIcon } from "@/src/utils/socialIcons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import styles from "@/app/news/[slug]/page.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

function addToRefArray(arrayRef, el) {
  if (el && !arrayRef.current.includes(el)) {
    arrayRef.current.push(el);
  }
}

export default function NewsPageAnimatedContent({ news, locale }) {
  const leftBlockRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const moreTextRefs = useRef([]);
  const listItemRefs = useRef([]);

  moreTextRefs.current = [];
  listItemRefs.current = [];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const commonTrigger = {
        start: "top bottom",
        toggleActions: "play none none none",
      };

      function splitAndAnimate(element, delay) {
        const split = new SplitText(element, {
          type: "lines",
          linesClass: "split-line",
          mask: "lines",
        });

        gsap.set(split.lines, { yPercent: 100, opacity: 0 });

        gsap.to(split.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.08,
          delay: delay || 0,
          ease: "power3.out",
          scrollTrigger: { ...commonTrigger, trigger: element },
        });

        return split;
      }

      const splitInstances = [];

      if (leftBlockRef.current) {
        gsap.fromTo(
          leftBlockRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: leftBlockRef.current,
            },
          },
        );
      }

      if (imageWrapperRef.current) {
        gsap.fromTo(
          imageWrapperRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: imageWrapperRef.current,
            },
          },
        );
      }

      moreTextRefs.current.forEach((el, index) => {
        if (el) {
          splitInstances.push(splitAndAnimate(el, index * 0.05));
        }
      });

      listItemRefs.current.forEach((el, index) => {
        if (el) {
          splitInstances.push(splitAndAnimate(el, index * 0.05));
        }
      });

      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        splitInstances.forEach((split) => {
          split.revert();
        });
      };
    });

    return () => {
      ctx.revert();
    };
  }, [news, locale]);

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.leftBlock} ref={leftBlockRef}>
        <Link
          href={locale === "en" ? "/en/news" : "/news"}
          className={styles.back}
        >
          <BiChevronsLeft className={styles.icon} />
          <p>{news.backText}</p>
        </Link>
        <div className={styles.titleWrapper}>
          <div
            className={styles.monthWrapper}
            style={
              news.type === "news" ? { justifyContent: "flex-end" } : undefined
            }
          >
            {news.type === "offers" ? (
              <p className={styles.offer}>{news.typeName}</p>
            ) : (
              ""
            )}
            {news.type === "news" ? (
              <p className={styles.month}>{news.month}</p>
            ) : (
              ""
            )}
          </div>
          <p className={styles.title}>{news.title}</p>
          <div
            className={styles.socialContent}
            style={
              news.type === "news" ? { justifyContent: "flex-end" } : undefined
            }
          >
            {news.type === "offers" ? (
              <Button title={news.dateBy} small></Button>
            ) : (
              ""
            )}
            <div className={styles.socialWrapper}>
              {news.socialIcons?.map((icon) => {
                const Icon = getSocialIcon(icon.title);
                if (!Icon) return null;

                return (
                  <a
                    key={icon.id}
                    href={icon.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    <Icon
                      className={
                        icon.title === "facebook" || icon.title === "telegram"
                          ? `${styles.icon} ${styles.iconfacebook}`
                          : styles.icon
                      }
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.rightBlock}>
        <div className={styles.imageWrapper} ref={imageWrapperRef}>
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${news.image.url}`}
            fill
            alt="image"
            className={styles.image}
          />
        </div>
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          components={{
            p: ({ children }) => (
              <p
                className={styles.moreText}
                ref={(el) => addToRefArray(moreTextRefs, el)}
              >
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <span className={styles.strong}>{children}</span>
            ),
            li: ({ children }) => (
              <li
                className={styles.listItem}
                ref={(el) => addToRefArray(listItemRefs, el)}
              >
                {children}
              </li>
            ),
          }}
        >
          {news.descriptionMore}
        </ReactMarkdown>
      </div>
    </div>
  );
}
