"use client";
import { useState, useRef } from "react";
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

const Advantages = ({ data, locale }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const activeCard = data.advantagesCards[activeIndex];

  const goNext = () => {
    swiperRef.current?.slideNext();
  };

  const goPrev = () => {
    swiperRef.current?.slidePrev();
  };

  return (
    <div className={styles.advantages}>
      <BlockTitle
        title={data.blockTitle.title}
        image={data.blockTitle.image.url}
      ></BlockTitle>
      <div className={styles.slider}>
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
        <div className={styles.content}>
          <Button
            className={styles.moreButton}
            title={data.moreButton.title}
            small
            link
            href={`${locale === "en" ? "/en" : ""}${data.moreButton.href}`}
            icon={data.moreButton.icon.url}
          ></Button>
          <p className={styles.title}>{activeCard.title}</p>
          <p className={styles.description}>{activeCard.description}</p>
          <div className={styles.paginationWrapper}>
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
