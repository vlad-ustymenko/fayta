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

const Header = ({ data }) => {
  const { setOpenSidebar } = useSidebarContext();
  const { activeMenu, setActiveMenu } = useMenuContext();
  const pathname = usePathname();
  const homeHref = getHomePath(pathname);

  return (
    <header className={styles.header}>
      <nav className={styles.menu}>
        {data.menuLinks.map((item) => (
          <Link
            key={item.id}
            href={buildNavHref(item.blockID, pathname)}
            className={styles.link}
          >
            {item.title}
          </Link>
        ))}
      </nav>
      <Link href={homeHref} className={styles.logo}>
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${data.logo.url}`}
          fill
          alt="logo"
          className={styles.image}
          onClick={() => setActiveMenu(false)}
        />
      </Link>
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
