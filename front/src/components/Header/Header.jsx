"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import LangSwicher from "../LangSwitcher/LangSwitcher";
import Button from "../Button/Button";
import BurgerBTN from "../BurgerBTN/BurgerBTN";
import { useSidebarContext } from "@/context/SidebarContext";
import { useMenuContext } from "@/context/MenuContext";
import { buildNavHref, getHomePath } from "@/src/utils/nav";

const ABOUT_TITLES = ["Про проект", "About"];

const Header = ({ data }) => {
  const { setOpenSidebar } = useSidebarContext();
  const { activeMenu, setActiveMenu } = useMenuContext();
  const pathname = usePathname();
  const homeHref = getHomePath(pathname);

  const isEnglish = pathname.startsWith("/en");

  function getMenuItemHref(item) {
    if (ABOUT_TITLES.includes(item.title)) {
      return isEnglish ? "/en/about" : "/about";
    }

    return buildNavHref(item.blockID, pathname);
  }

  return (
    <header className={styles.header}>
      <nav className={styles.menu}>
        {data.menuLinks.map((item) => (
          <a key={item.id} href={getMenuItemHref(item)} className={styles.link}>
            {item.title}
          </a>
        ))}
      </nav>
      <a href={homeHref} className={styles.logo}>
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data.logo.url}`}
          fill
          alt="logo"
          className={styles.image}
          onClick={() => setActiveMenu(false)}
        />
      </a>

      <div className={styles.buttonsWrapper}>
        <LangSwicher className={styles.langSwitcher} />
        <Button
          className={styles.button}
          title={data.button}
          onClick={() => setOpenSidebar(true)}
          small
        ></Button>
      </div>
      <BurgerBTN
        checked={activeMenu}
        onClick={() => setActiveMenu(!activeMenu)}
      ></BurgerBTN>
    </header>
  );
};

export default Header;
