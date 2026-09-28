// src/components/BuildingAnimatedContent/BuildingAnimatedContent.jsx
"use client";

import React, { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { BiChevronsLeft } from "react-icons/bi";
import BuildingGallery from "@/src/components/BuildingGalery/BuildingGallery";
import { getSocialIcon } from "@/src/utils/socialIcons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import styles from "@/app/[locale]/building/[slug]/page.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

function addToRefArray(arrayRef, el) {
  if (el && !arrayRef.current.includes(el)) {
    arrayRef.current.push(el);
  }
}

export default function BuildingAnimatedContent({
  building,
  locale,
  shortsEmbedUrl,
}) {
  const backRef = useRef(null);
  const titleWrapperRef = useRef(null);
  const videoTitleRef = useRef(null);
  const videoRef = useRef(null);
  const imageWrapperRef = useRef(null);

  const moreTextRefs = useRef([]);
  const listItemRefs = useRef([]);

  moreTextRefs.current = [];
  listItemRefs.current = [];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const commonTrigger = {
        start: "top bottom",
        toggleActions: "play none none reverse",
      };

      function fadeUp(el, delay) {
        if (!el) {
          return;
        }

        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: delay || 0,
            ease: "power2.out",
            scrollTrigger: { ...commonTrigger, trigger: el },
          },
        );
      }

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

      fadeUp(backRef.current, 0);
      fadeUp(titleWrapperRef.current, 0.1);
      fadeUp(videoTitleRef.current, 0.15);
      fadeUp(videoRef.current, 0.2);
      fadeUp(imageWrapperRef.current, 0);

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
  }, [building, locale]);

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.leftBlock}>
        <Link
          href={locale === "en" ? "/en/building" : "/building"}
          className={styles.back}
          ref={backRef}
        >
          <BiChevronsLeft className={styles.icon} />
          <p>{building.backText}</p>
        </Link>
        <div className={styles.titleWrapper} ref={titleWrapperRef}>
          <p className={styles.month}>{building.month}</p>
          <p className={styles.title}>{building.title}</p>
          <div className={styles.socialWrapper}>
            {building.socialIcons?.map((icon) => {
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
                  <Icon className={styles.icon} />
                </a>
              );
            })}
          </div>
        </div>
        <p className={styles.videoTitle} ref={videoTitleRef}>
          {building.youtubeLink.title}
        </p>
        {shortsEmbedUrl && (
          <div ref={videoRef}>
            <iframe
              className={styles.video}
              src={shortsEmbedUrl}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
      </div>
      <div className={styles.rightBlock}>
        <div ref={imageWrapperRef}>
          <BuildingGallery images={building.images} />
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
          {building.moreText}
        </ReactMarkdown>
      </div>
    </div>
  );
}
