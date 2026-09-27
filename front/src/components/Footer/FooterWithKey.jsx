"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWithKey({ data }) {
  const pathname = usePathname();

  return <Footer data={data} key={pathname} />;
}
