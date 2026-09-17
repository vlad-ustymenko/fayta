"use client";

import Image from "next/image";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import styles from "./BuildingGallery.module.css";

const BuildingGallery = ({ images }) => {
  const swiperRef = useRef(null);

  return (
    <div className={styles.galleryWrapper}>
      <Swiper
        pagination={{ clickable: true }}
        slidesPerView={1}
        loop={images.length > 1}
        speed={600}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className={styles.swiperCard}
      >
        {images.map((image) => (
          <SwiperSlide key={image.documentId}>
            <div className={styles.imageWrapper}>
              <Image
                className={styles.image}
                src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${image.url}`}
                alt="project image"
                fill
                sizes="(max-width: 768px) 90vw, (min-width: 768px) and (max-width: 1023px) 90vw, 45vw"
              />
            </div>
          </SwiperSlide>
        ))}
        {images.length > 1 && (
          <>
            <button
              className={`${styles.cardNav} ${styles.cardPrev}`}
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <BiChevronsLeft className={`${styles.icon} ${styles.iconLeft}`} />
            </button>

            <button
              className={`${styles.cardNav} ${styles.cardNext}`}
              onClick={() => swiperRef.current?.slideNext()}
            >
              <BiChevronsRight
                className={`${styles.icon} ${styles.iconRight}`}
              />
            </button>
          </>
        )}
      </Swiper>
    </div>
  );
};

export default BuildingGallery;
