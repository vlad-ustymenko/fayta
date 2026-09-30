"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { getSocialIcon } from "@/src/utils/socialIcons";
import { useModal } from "@/context/ModalContext";
import { useSidebarContext } from "@/context/SidebarContext";
import Loader from "../Loader/Loader";

import styles from "./Modal.module.css";

const Modal = ({ data }) => {
  const { isOpen, sending, closeModal } = useModal();
  const { setOpenSidebar } = useSidebarContext();

  const handleClose = () => {
    closeModal();
    setOpenSidebar(false);
  };

  useEffect(() => {
    if (!isOpen) {
      document.documentElement.style.overflow = "";
      return;
    }

    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={sending ? styles.sending : styles.modal}
      onClick={handleClose}
    >
      {sending ? (
        <Loader title={data.loaderText} />
      ) : (
        <div
          className={styles.formWrapper}
          onClick={(event) => event.stopPropagation()}
        >
          <h2 className={styles.title}>{data.title}</h2>

          <ReactMarkdown
            remarkPlugins={[remarkBreaks]}
            components={{
              p: ({ children }) => (
                <p className={styles.formContent}>{children}</p>
              ),
            }}
          >
            {data.text}
          </ReactMarkdown>

          <h3 className={styles.socialTitle}>{data.socialText}</h3>

          <div className={styles.socialWrapper}>
            {data.socialIcons?.map((icon) => {
              const Icon = getSocialIcon(icon.title);

              if (!Icon) {
                return null;
              }

              return (
                <a
                  key={icon.id}
                  href={icon.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <Icon className={styles.socialIcon} />
                </a>
              );
            })}
          </div>
          <IoClose className={styles.closeButton} onClick={handleClose} />
        </div>
      )}
    </div>
  );
};

export default Modal;
