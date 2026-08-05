"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";
import LangSwicher from "../LangSwitcher/LangSwitcher";
import Button from "../Button/Button";
import BurgerBTN from "../BurgerBTN/BurgerBTN";
import { useSidebarContext } from "@/context/SidebarContext";

const Header = ({ data }) => {
  const { setOpenSidebar } = useSidebarContext();
  return (
    <header className={styles.header}>
      <nav className={styles.menu}>
        {data.menuLinks.map((item) => (
          <a key={item.id} href={item.link} className={styles.link}>
            {item.title}
          </a>
        ))}
      </nav>
      <a href="#" className={styles.logo}>
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data.logo.url}`}
          fill
          alt="logo"
          className={styles.image}
        />
      </a>
      <div className={styles.buttonsWrapper}>
        <LangSwicher />
        <Button
          className={styles.button}
          title={data.button}
          link
          onClick={() => setOpenSidebar(true)}
        ></Button>
      </div>
      <BurgerBTN></BurgerBTN>
    </header>
  );
};

export default Header;
