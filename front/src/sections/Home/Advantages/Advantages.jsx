"use client";
import { useState, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCube, Pagination } from "swiper/modules";
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import Button from "../../../components/Button/Button";
import styles from "./Advantages.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

function splitAndAnimate(element, { delay = 0 } = {}) {
  const split = new SplitText(element, {
    type: "lines",
    linesClass: "split-line",
    mask: "lines",
  });

  gsap.set(split.lines, {
    yPercent: 100,
    opacity: 0,
  });

  gsap.to(split.lines, {
    yPercent: 0,
    opacity: 1,
    duration: 0.75,
    stagger: 0.1,
    delay,
    ease: "power3.out",
  });

  return split;
}

const Advantages = ({ data, locale }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const rootRef = useRef(null);
  const blockTitleRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const moreButtonRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const paginationWrapperRef = useRef(null);

  const titleSplitRef = useRef(null);
  const descriptionSplitRef = useRef(null);

  const firstCard = data.advantagesCards[0];

  const commonTrigger = () => ({
    trigger: rootRef.current,
    start: "top bottom",
    toggleActions: "play none none reverse",
  });

  // Оновлює title/description ІМПЕРАТИВНО, в обхід React,
  // щоб SplitText не конфліктував з реконсиляцією.
  // Грає одразу, без власного scrollTrigger — цей шлях перевірено робочий.
  function playTextEnter(card) {
    if (titleSplitRef.current) titleSplitRef.current.revert();
    if (descriptionSplitRef.current) descriptionSplitRef.current.revert();

    if (titleRef.current) titleRef.current.textContent = card.title;
    if (descriptionRef.current)
      descriptionRef.current.textContent = card.description;

    if (titleRef.current) {
      titleSplitRef.current = splitAndAnimate(titleRef.current, {
        delay: 0,
      });
    }

    if (descriptionRef.current) {
      descriptionSplitRef.current = splitAndAnimate(descriptionRef.current, {
        delay: 0.15,
      });
    }
  }

  const goNext = () => {
    swiperRef.current?.slideNext();
  };

  const goPrev = () => {
    swiperRef.current?.slidePrev();
  };

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const trigger = commonTrigger();

      if (blockTitleRef.current) {
        gsap.fromTo(
          blockTitleRef.current,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: { ...trigger, trigger: blockTitleRef.current },
          },
        );
      }

      if (imageWrapperRef.current) {
        gsap.fromTo(
          imageWrapperRef.current,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: { ...trigger, trigger: imageWrapperRef.current },
          },
        );
      }

      if (titleRef.current) {
        gsap.fromTo(
          { progress: 0 },
          { progress: 0 },
          {
            progress: 1,
            duration: 1,
            scrollTrigger: {
              ...trigger,
              trigger: titleRef.current,
              once: true,
            },
            onStart: () => {
              playTextEnter(firstCard);
            },
          },
        );
      }

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions;

          if (moreButtonRef.current) {
            const xPercentValue = isDesktop ? 50 : 0;
            gsap.fromTo(
              moreButtonRef.current,
              { opacity: 0, xPercent: xPercentValue, x: 100 },
              {
                opacity: 1,
                xPercent: xPercentValue,
                x: 0,
                duration: 1,
                ease: "power5.out",
                scrollTrigger: { ...trigger, trigger: moreButtonRef.current },
              },
            );
          }

          if (paginationWrapperRef.current) {
            const xPercentValue = isDesktop ? -50 : 0;
            gsap.fromTo(
              paginationWrapperRef.current,
              { opacity: 0, xPercent: xPercentValue, x: 100 },
              {
                opacity: 1,
                xPercent: xPercentValue,
                x: 0,
                duration: 1,
                ease: "power5.out",
                scrollTrigger: {
                  ...trigger,
                  trigger: paginationWrapperRef.current,
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
      if (titleSplitRef.current) titleSplitRef.current.revert();
      if (descriptionSplitRef.current) descriptionSplitRef.current.revert();
    };
  }, [data]);

  return (
    <div className={styles.advantages} ref={rootRef}>
      <div ref={blockTitleRef}>
        <BlockTitle
          title={data.blockTitle.title}
          image={data.blockTitle.image.url}
        ></BlockTitle>
      </div>
      <div className={styles.slider}>
        <div ref={imageWrapperRef}>
          <Swiper
            effect={"cube"}
            cubeEffect={{
              shadow: false,
              slideShadows: false,
            }}
            loop
            modules={[EffectCube, Pagination]}
            className={styles.imageWrapper}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
              playTextEnter(data.advantagesCards[swiper.realIndex]);
            }}
          >
            {data.advantagesCards.map((item) => (
              <SwiperSlide key={item.documentId}>
                <div>
                  <Image
                    className={styles.image}
                    src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${item.image.url}`}
                    alt="project image"
                    fill
                    sizes="(max-width: 768px) 90vw, (min-width: 768px) and (max-width: 1023px) 90vw, 45vw"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className={styles.content}>
          <div ref={moreButtonRef}>
            <Button
              className={styles.moreButton}
              title={data.moreButton.title}
              link
              href={`${locale === "en" ? "/en" : ""}${data.moreButton.href}`}
              icon={data.moreButton.icon.url}
            ></Button>
          </div>
          <p className={styles.title} ref={titleRef}>
            {firstCard.title}
          </p>
          <p className={styles.description} ref={descriptionRef}>
            {firstCard.description}
          </p>
          <div className={styles.paginationWrapper} ref={paginationWrapperRef}>
            <div className={styles.buttonsWrapper}>
              <div className={styles.button} onClick={goPrev}>
                <BiChevronsLeft className={styles.icon}></BiChevronsLeft>
                <span className={styles.line}></span>
              </div>
              <div className={styles.button} onClick={goNext}>
                <span className={styles.line}></span>
                <BiChevronsRight className={styles.icon}></BiChevronsRight>
              </div>
            </div>
            <div className={styles.pagination}>
              <p className={styles.activeSlide}>{activeIndex + 1}</p>
              <p className={styles.separator}>/</p>
              <p className={styles.totalSlides}>
                {data.advantagesCards.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advantages;
