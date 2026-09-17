import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Button.module.css";

const Button = ({
  form,
  title,
  link,
  href,
  small,
  icon = false,
  logo,
  className,
  onClick,
}) => {
  if (link) {
    return (
      <div className={`${styles.linkWrapper} ${styles.button} ${className}`}>
        <Link
          href={href}
          className={`${styles.title} ${small && styles.smallTitle}`}
        >
          {title}
        </Link>
        {icon && (
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${icon}`}
            alt="icon"
            width={53}
            height={38}
            className={`${styles.icon} ${small && styles.smallIcon}`}
          />
        )}
      </div>
    );
  }

  // if (form) {
  //   return (
  //     <button
  //       type={form ? "submit" : "button"}
  //       className={`${styles.button} ${className}`}
  //       onClick={onClick}
  //     >
  //       <div className={styles.wrapper}>
  //         <p className={`${styles.title} ${small && styles.smallTitle}`}>
  //           {title}
  //         </p>
  //         {icon && (
  //           <Image
  //             src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${icon}`}
  //             alt="icon"
  //             width={53}
  //             height={38}
  //             className={`${styles.icon} ${small && styles.smallIcon}`}
  //           />
  //         )}
  //       </div>
  //     </button>
  //   );
  // }

  return (
    <button
      type={form ? "submit" : "button"}
      className={`${styles.button} ${className}`}
      onClick={onClick}
    >
      <div className={styles.wrapper}>
        <p className={`${styles.title} ${small && styles.smallTitle}`}>
          {title}
        </p>
        {icon && (
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${icon}`}
            alt="icon"
            width={53}
            height={38}
            className={`${styles.icon} ${small && styles.smallIcon}`}
          />
        )}
      </div>
    </button>
  );
};

export default Button;
