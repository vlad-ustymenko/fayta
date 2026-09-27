"use client";

import Image from "next/image";
import React, { useState, useRef, useCallback, useLayoutEffect } from "react";
import "swiper/css";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { Swiper, SwiperSlide } from "swiper/react";
import BlockTitle from "../BlockTitle/BlockTitle";
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
import Button from "../Button/Button";
import { useSidebarContext } from "@/context/SidebarContext";
import styles from "./ApartmentsRoomFilter.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ApartmentsRoomFilter = ({ data, apartmentCategories }) => {
  const { setOpenSidebar } = useSidebarContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const rootRef = useRef(null);
  const swiperWrapperRef = useRef(null);
  const paginationRef = useRef(null);

  const category = apartmentCategories.filter(
    (item) => item.slug === data[0].category,
  )[0];

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  const handleDotClick = useCallback((i) => {
    swiperRef.current?.slideToLoop(i);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const commonTrigger = {
        trigger: rootRef.current,
        start: "top bottom",
        toggleActions: "play none none none",
      };

      if (swiperWrapperRef.current) {
        const slides = swiperWrapperRef.current.querySelectorAll(
          `.${styles.card}`,
        );

        slides.forEach((slide, index) => {
          const fromX = index % 2 === 0 ? -100 : 100;

          gsap.fromTo(
            slide,
            { opacity: 0, x: fromX },
            {
              opacity: 1,
              x: 0,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                ...commonTrigger,
                trigger: slide,
              },
            },
          );
        });
      }

      if (paginationRef.current) {
        gsap.fromTo(
          paginationRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              ...commonTrigger,
              trigger: paginationRef.current,
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
  }, [data]);

  return (
    <div ref={rootRef}>
      <BlockTitle
        title={category.title}
        image="/logo.svg"
        className={styles.blockTitle}
        local
      />
      <div ref={swiperWrapperRef}>
        <Swiper
          pagination={{ clickable: true }}
          slidesPerView={1}
          spaceBetween={100}
          loop={data.length > 1}
          speed={600}
          className={styles.swiper}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 100,
            },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
        >
          {data.map((card, i) => (
            <SwiperSlide key={card.documentId}>
              <div className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Image
                    className={styles.image}
                    src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${card.image.url}`}
                    alt="project image"
                    fill
                    sizes="(max-width: 768px) 90vw, (min-width: 768px) and (max-width: 1023px) 90vw, 45vw"
                  />
                </div>
                <div className={styles.contentWrapper}>
                  <div className={styles.titleWrapper}>
                    <p className={styles.title}>
                      {`${card.apartmentCharacters[0].characterTitle} ${card.apartmentCharacters[0].characterText}`}
                    </p>
                    <p className={styles.area}>{card.apartmentArea}</p>
                  </div>
                  <ReactMarkdown
                    remarkPlugins={[remarkBreaks]}
                    components={{
                      p: ({ children }) => (
                        <p className={styles.cardText}>{children}</p>
                      ),
                      li: ({ children }) => (
                        <li className={styles.cardList}>{children}</li>
                      ),
                    }}
                  >
                    {card.apartmentMore}
                  </ReactMarkdown>
                  <Button
                    className={styles.button}
                    title={card.button}
                    small
                    onClick={() => setOpenSidebar(true)}
                  ></Button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.pagination} ref={paginationRef}>
        <BiChevronsLeft className={styles.nav} onClick={handlePrev} />

        <div className={styles.dotsWrapper}>
          {data.map((card, i) => (
            <div
              className={`${styles.dot} ${
                i === activeIndex ? styles.dotActive : ""
              }`}
              key={card.documentId ?? card.id}
              onClick={() => handleDotClick(i)}
            ></div>
          ))}
        </div>
        <BiChevronsRight className={styles.nav} onClick={handleNext} />
      </div>
    </div>
  );
};

export default ApartmentsRoomFilter;
