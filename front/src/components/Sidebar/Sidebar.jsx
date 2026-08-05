"use client";

import { useEffect, useState, useRef } from "react";
import { useSidebarContext } from "@/context/SidebarContext";
import { IoClose } from "react-icons/io5";
import Form from "../Form/Form";
import styles from "./Sidebar.module.css";

export default function Sidebar({ data }) {
  const { openSidebar, setOpenSidebar } = useSidebarContext();
  const [isMounted, setIsMounted] = useState(openSidebar);

  const sidebarRef = useRef(null);

  console.log(data);

  useEffect(() => {
    if (openSidebar) {
      setIsMounted(true);
      setTimeout(() => {
        sidebarRef.current?.classList.add(styles.open);
      }, 100);
    } else {
      sidebarRef.current?.classList.remove(styles.open);
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 500); // час анімації

      return () => clearTimeout(timer);
    }
  }, [openSidebar]);

  if (!isMounted) return null;

  return (
    <aside className={`${styles.sidebar} `} ref={sidebarRef}>
      <IoClose className={styles.close} onClick={() => setOpenSidebar(false)} />
      <Form data={data} />
    </aside>
  );
}
