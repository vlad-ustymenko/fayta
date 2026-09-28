"use client";
import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSocialIcon } from "../../utils/socialIcons";
import { buildNavHref, getHomePath } from "@/src/utils/nav";
import styles from "./Footer.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

function addToRefArray(arrayRef, el) {
  if (el && !arrayRef.current.includes(el)) {
    arrayRef.current.push(el);
  }
}

const Footer = ({ data }) => {
  const pathname = usePathname();
  const homeHref = getHomePath(pathname);

  const rootRef = useRef(null);
  const leftLinksRef = useRef([]);
  const rightLinksRef = useRef([]);
  const iconWrapperRef = useRef(null);
  const socialTextRef = useRef(null);
  const socialWrapperRef = useRef(null);
  const copyrightRef = useRef(null);
  const policyRef = useRef(null);

  leftLinksRef.current = [];
  rightLinksRef.current = [];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const commonTrigger = {
        trigger: rootRef.current,
        start: "top bottom",
        toggleActions: "play none none reverse",
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
          duration: 1.5,
          stagger: 0.08,
          delay: delay || 0,
          ease: "power3.out",
          scrollTrigger: { ...commonTrigger, trigger: element },
        });

        return split;
      }

      const splitInstances = [];

      leftLinksRef.current.forEach((el) => {
        if (el) {
          splitInstances.push(splitAndAnimate(el, 0));
        }
      });

      rightLinksRef.current.forEach((el) => {
        if (el) {
          splitInstances.push(splitAndAnimate(el, 0));
        }
      });

      if (iconWrapperRef.current) {
        gsap.fromTo(
          iconWrapperRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: iconWrapperRef.current,
            },
          },
        );
      }

      if (socialTextRef.current) {
        splitInstances.push(splitAndAnimate(socialTextRef.current, 0));
      }

      if (socialWrapperRef.current) {
        const socialItems = socialWrapperRef.current.querySelectorAll(
          "." + styles.socialLinkWrapper,
        );

        gsap.fromTo(
          socialItems,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: {
              ...commonTrigger,
              trigger: socialWrapperRef.current,
            },
          },
        );
      }

      if (copyrightRef.current) {
        gsap.fromTo(
          copyrightRef.current,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: copyrightRef.current,
            },
          },
        );
      }

      if (policyRef.current) {
        gsap.fromTo(
          policyRef.current,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: policyRef.current,
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
        splitInstances.forEach((split) => {
          split.revert();
        });
      };
    }, rootRef);

    return () => {
      console.log("Footer effect cleanup", { pathname });
      ctx.revert();
    };
  }, [data]);

  return (
    <div className={styles.footer} ref={rootRef}>
      <div className={styles.grid}>
        <div className={styles.leftBlock}>
          {data.leftBlock.map((item) => (
            <Link
              key={item.id}
              href={buildNavHref(item.blockID, pathname)}
              className={styles.link}
              ref={(el) => addToRefArray(leftLinksRef, el)}
            >
              {item.title}
            </Link>
          ))}
        </div>
        <div className={styles.iconWrapper} ref={iconWrapperRef}>
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data.icon.url}`}
            alt="logo"
            fill
            className={styles.logo}
          />
        </div>
        <div className={styles.rightBlock}>
          {data.rightBlock.map((item) => (
            <Link
              key={item.id}
              href={buildNavHref(item.blockID, pathname)}
              className={styles.link}
              ref={(el) => addToRefArray(rightLinksRef, el)}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
      <p className={styles.socialText} ref={socialTextRef}>
        {data.socialText}
      </p>
      <div className={styles.socialWrapper} ref={socialWrapperRef}>
        {data.socialIcons?.map((icon) => {
          const Icon = getSocialIcon(icon.title);
          if (!Icon) {
            return null;
          }

          const iconClassName =
            icon.title === "facebook" || icon.title === "telegram"
              ? `${styles.icon} ${styles.iconfacebook}`
              : styles.icon;

          return (
            <div key={icon.id} className={styles.socialLinkWrapper}>
              <a
                href={icon.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <Icon className={iconClassName} />
              </a>
            </div>
          );
        })}
      </div>
      <div className={styles.line}></div>
      <div className={styles.copyrightWrapper}>
        <p className={styles.copyright} ref={copyrightRef}>
          {data.copyright}
        </p>
        <a href={data.policy.link} className={styles.policy} ref={policyRef}>
          {data.policy.title}
        </a>
      </div>
    </div>
  );
};

export default Footer;
