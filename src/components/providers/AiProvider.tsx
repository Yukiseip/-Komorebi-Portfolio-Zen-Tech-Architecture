"use client";

import React, { createContext, useContext, useState } from "react";

interface AiContextProps {
  isOpen: boolean;
  message: string;
  openAi: (msg?: string) => void;
  closeAi: () => void;
}

const AiContext = createContext<AiContextProps | undefined>(undefined);

// Default message updated for Yukisei, maintaining third person for Francisco
const DEFAULT_MSG = "Bienvenido. Soy Yukisei, la interfaz asintente del Creador. ¿Qué deseas consultar sobre los proyectos, experiencia o habilidades de Francisco?";

export const AiProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MSG);

  const openAi = (msg?: string) => {
    if (msg) setMessage(msg);
    setIsOpen(true);
  };

  const closeAi = () => {
    setIsOpen(false);
    setTimeout(() => setMessage(DEFAULT_MSG), 500); // Reset after close animation
  };

  return (
    <AiContext.Provider value={{ isOpen, message, openAi, closeAi }}>
      {children}
    </AiContext.Provider>
  );
};

export const useAi = () => {
  const ctx = useContext(AiContext);
  if (!ctx) throw new Error("useAi must be used within AiProvider");
  return ctx;
};
