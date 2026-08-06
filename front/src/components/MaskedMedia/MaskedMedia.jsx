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
    WebkitMaskImage: `url(${logoSrc})`,
    maskImage: `url(${logoSrc})`,
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {type === "video" ? (
        <video
          className={styles.maskedMedia}
          style={maskStyle}
          src={src}
          // poster={poster}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className={styles.maskedMedia}
          style={maskStyle}
          unoptimized={src.startsWith("http")}
        />
      )}
    </div>
  );
}
