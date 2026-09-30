"use client";

import React, { useLayoutEffect, useRef } from "react";
import Form from "../../../components/Form/Form";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import { getSocialIcon } from "../../../utils/socialIcons";
import Image from "next/image";
import styles from "./Contacts.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Contacts = ({ data }) => {
  const rootRef = useRef(null);
  const blockTitleRef = useRef(null);
  const leftBlockRef = useRef(null);
  const mapWrapperRef = useRef(null);
  const rightBlockRef = useRef(null);
  const imageWrapperRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const commonTrigger = {
        trigger: rootRef.current,
        start: "top bottom",
        toggleActions: "play none none reverse",
      };

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

      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isDesktop: "(min-width: 768px)",
        },
        (context) => {
          const isMobile = context.conditions.isMobile;

          if (!leftBlockRef.current) {
            return;
          }

          const infoItems = Array.from(
            leftBlockRef.current.querySelectorAll(`.${styles.infoWrapper}`),
          );

          if (isMobile) {
            infoItems.forEach((item) => {
              gsap.fromTo(
                item,
                { opacity: 0, y: 30 },
                {
                  opacity: 1,
                  y: 0,
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
              infoItems,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                stagger: 0.15,
                scrollTrigger: {
                  ...commonTrigger,
                  trigger: leftBlockRef.current,
                },
              },
            );
          }
        },
      );

      if (mapWrapperRef.current) {
        gsap.fromTo(
          mapWrapperRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: mapWrapperRef.current,
            },
          },
        );
      }

      if (rightBlockRef.current) {
        gsap.fromTo(
          rightBlockRef.current,
          { opacity: 0, x: 100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: rightBlockRef.current,
            },
          },
        );
      }

      if (imageWrapperRef.current) {
        gsap.fromTo(
          imageWrapperRef.current,
          { x: -100 },
          {
            x: 0,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: imageWrapperRef.current,
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
      mm.revert();
      ctx.revert();
    };
  }, [data]);

  return (
    <div className={styles.contacts} id="contacts" ref={rootRef}>
      <div ref={blockTitleRef}>
        <BlockTitle
          title={data.blockTitle.title}
          image={data.blockTitle.image.url}
        />
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.leftBlock} ref={leftBlockRef}>
          {data.contactsInfo.map((item) => {
            switch (item.type) {
              case "phone": {
                return (
                  <div key={item.id} className={styles.infoWrapper}>
                    <div className={styles.infoTitle}>{item.title}</div>
                    <a href={`tel:${item.text}`} className={styles.infoText}>
                      {item.text}
                    </a>
                  </div>
                );
              }
              case "email": {
                return (
                  <div key={item.id} className={styles.infoWrapper}>
                    <div className={styles.infoTitle}>{item.title}</div>
                    <a
                      href={`mailto:info@${item.text}`}
                      className={styles.infoText}
                    >
                      {item.text}
                    </a>
                  </div>
                );
              }
              case "address": {
                return (
                  <div
                    key={item.id}
                    className={`${styles.infoWrapper} ${styles.infoWrapperAddress}`}
                  >
                    <div className={styles.infoTitle}>{item.title}</div>
                    <a
                      href={data.googleMap}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.infoText}
                    >
                      {item.text}
                    </a>
                  </div>
                );
              }
              default: {
                return null;
              }
            }
          })}
          <div className={styles.mapWrapper} ref={mapWrapperRef}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3731.8895175050134!2d22.2660837185108!3d48.59367839555191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4739191f9f854025%3A0x8ce402365ce544bc!2z0LLRg9C7LiDQpNC10YDQtdC90YbQsCDQodC10LzQsNC90LAsINCc0LjQvdCw0LksINCX0LDQutCw0YDQv9Cw0YLRgdGM0LrQsCDQvtCx0LvQsNGB0YLRjCwgODk0MjQ!5e0!3m2!1sru!2sua!4v1789325211938!5m2!1sru!2sua"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
        </div>
        <div className={styles.rightBlock} ref={rightBlockRef}>
          <div className={styles.imageWrapper} ref={imageWrapperRef}>
            <Image
              src="/black.png"
              alt="image"
              fill
              className={styles.image}
            ></Image>
          </div>
          <h2 className={styles.rightBlockTitle}>{data.rightBlockTitle}</h2>
          <Form
            loaderText={data.loaderText}
            form={data.form}
            button={data.button}
            confidentialText={data.confidentialText}
            feedback
          ></Form>
          <div className={styles.socialText}>{data.socialText}</div>
          <div className={styles.socialWrapper}>
            {data.socialIcons?.map((icon) => {
              const Icon = getSocialIcon(icon.title);
              if (!Icon) {
                return null;
              }

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
                      icon.title === "facebook"
                        ? `${styles.iconFacebook} ${styles.icon}`
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
  );
};

export default Contacts;
