"use client";
import React from "react";
import Image from "next/image";
import styles from "./Concept.module.css";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import remarkBreaks from "remark-breaks";
import MaskedMedia from "../../../components/MaskedMedia/MaskedMedia";
import Button from "../../../components/Button/Button";
import { useSidebarContext } from "@/context/SidebarContext";
import ReactMarkdown from "react-markdown";

const Concept = ({ data }) => {
  const { setOpenSidebar } = useSidebarContext();
  return (
    <div className={styles.concept}>
      <BlockTitle
        title={data.blockTitle.title}
        image={data.blockTitle.image.url}
      />
      <div className={styles.grid}>
        <div className={styles.content}>
          <ReactMarkdown
            remarkPlugins={[remarkBreaks]}
            components={{
              p: ({ children }) => <h2 className={styles.title}>{children}</h2>,
              strong: ({ children }) => (
                <span className={styles.strong}>{children}</span>
              ),
            }}
          >
            {data.title}
          </ReactMarkdown>
          <ReactMarkdown
            remarkPlugins={[remarkBreaks]}
            components={{
              p: ({ children }) => (
                <p className={styles.description}>{children}</p>
              ),
            }}
          >
            {data.description}
          </ReactMarkdown>
          <Button
            title={data.button.title}
            icon={data.button.icon.url}
            className={styles.button}
            onClick={() => setOpenSidebar(true)}
          ></Button>
        </div>
        <MaskedMedia
          src={data.maskedImage.backgroundImage.url}
          type="image"
          logoSrc={data.maskedImage.maskImage.url}
          className={styles.maskedMedia}
        ></MaskedMedia>
      </div>
    </div>
  );
};

export default Concept;
