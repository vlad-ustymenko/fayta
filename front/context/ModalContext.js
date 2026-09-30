"use client";

import { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }

  return context;
};

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [data, setData] = useState(null);

  const openModal = (modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSending(false);
    setData(null);
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        sending,
        data,
        openModal,
        closeModal,
        setSending,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
