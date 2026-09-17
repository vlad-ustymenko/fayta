"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import BlockTitle from "../../../components/BlockTitle/BlockTitle";
import Button from "../../../components/Button/Button";
import { useSidebarContext } from "@/context/SidebarContext";
import styles from "./TermsOfPurchase.module.css";

const TermsOfPurchase = ({ data }) => {
  const { setOpenSidebar } = useSidebarContext();
  return (
    <div className={styles.termsOfPurchase} id="termsOfPurchese">
      <BlockTitle
        title={data.blockTitle.title}
        image={data.blockTitle.image.url}
      />
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
      <div className={styles.cardsWrapper}>
        {data.cards.map((item) => (
          <div
            className={styles.card}
            key={item.id}
            onClick={() => setOpenSidebar(true)}
          >
            <div className={styles.cardTitle}>{item.title}</div>
            <div className={styles.cardDescription}>{item.description}</div>
            <ReactMarkdown
              remarkPlugins={[remarkBreaks]}
              components={{
                p: ({ children }) => (
                  <p className={styles.cardTerms}>{children}</p>
                ),
                strong: ({ children }) => (
                  <span className={styles.strongTerms}>{children}</span>
                ),
              }}
            >
              {item.terms}
            </ReactMarkdown>
            <Button
              className={styles.cardButton}
              title={item.button.title}
              href={item.button.href}
              icon={item.button.icon.url}
              small
            ></Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsOfPurchase;
