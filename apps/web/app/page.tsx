"use client";

import { useEffect, useRef, useState } from "react";
import Draw from "../components/draw";
import { useSocket } from "../hooks/useSocket";
import Toolbar from "../components/toolBar";
import { useShape } from "../contextAPI/shapeContext";

export default function CanvasAPI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { socket } = useSocket();
  const { shape } = useShape();

  useEffect(() => {
    if (!canvasRef.current || !socket || !shape) return;
    const cleanup = Draw(canvasRef.current, socket, shape);
    return () => {
      cleanup?.(); //safe clean up call (removing all old event listeners on unmounting)
    };
  }, [canvasRef, socket, shape]);
  

  return (
    <>

      <Toolbar/>
      <canvas
        ref={canvasRef}
        width="5000"
        height="5000"
        style={{ border: "2px solid white", backgroundColor: "white" }}
      ></canvas>
    </>
  );
}
