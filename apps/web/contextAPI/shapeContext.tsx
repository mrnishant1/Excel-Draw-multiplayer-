"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Typetool } from "../app/types/tooltype";

// Define the context shape
interface ShapeContextType {
  shape: Typetool | null;
  setShape: (tool: Typetool | null) => void;
}

// Create context with default undefined
const ShapeContext = createContext<ShapeContextType | undefined>(undefined);

// Provider with typing
export function ShapeContextProvider({ children }: { children: ReactNode }) {
  const [shape, setShape] = useState<Typetool | null>("select");

  return (
    <ShapeContext.Provider value={{ shape, setShape }}>
      {children}
    </ShapeContext.Provider>
  );
}

// Custom hook
export function useShape(): ShapeContextType {
  const context = useContext(ShapeContext);
  if (!context) throw new Error("useShape must be used within a ShapeContextProvider");
  return context;
}
