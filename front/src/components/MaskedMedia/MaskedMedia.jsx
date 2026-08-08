// components/MaskedMedia/MaskedMedia.jsx
"use client";

import Image from "next/image";
import styles from "./MaskedMedia.module.css";

// src - URL зображення або відео (з CMS)
// type - "image" або "video"
// logoSrc - URL SVG-логотипу, який буде маскою
// poster - постер для відео (опційно)
// alt - alt-текст для зображення
// className - додатковий клас для контейнера (задає width/height ззовні)

export default function MaskedMedia({
  src,
  type = "image",
  logoSrc,
  poster,
  alt = "",
  className = "",
}) {
  const maskStyle = {
    WebkitMaskImage: `url(${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${logoSrc})`,
    maskImage: `url(${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${logoSrc})`,
  };

  console.log(src);

  return (
    <div className={`${styles.container} ${className}`}>
      {type === "video" ? (
        <video
          className={styles.maskedMedia}
          style={maskStyle}
          src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${src}`}
          // poster={poster}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${src}`}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (min-width: 768px) and (max-width: 1023px) 100vw, 100vw"
          className={styles.maskedMedia}
          style={maskStyle}
        />
      )}
    </div>
  );
}
