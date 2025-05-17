"use client";

import { useEffect, useRef, useState } from "react";
import Draw from "../../components/draw";
import { useSocket } from "../../hooks/useSocket";
import Toolbar from "../../components/toolBar";
import { useShape } from "../../contextAPI/shapeContext";
import { ExistingShape } from "../types/tooltype";
import { useParams } from "next/navigation";

export default function CanvasAPI() {
  const params = useParams()
  const roomid = params.roomid?.toString();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { socket } = useSocket(roomid||"");
  const { shape } = useShape();
  const existingShapesRef = useRef<ExistingShape[]>([]);
  const pencilArray = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (!canvasRef.current || !socket || !shape) return;
    const cleanup = Draw(canvasRef.current, socket, shape, existingShapesRef.current, pencilArray.current);
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
