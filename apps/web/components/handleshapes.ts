import { RoughCanvas } from "roughjs/bin/canvas";
import { Typetool } from "../app/types/tooltype";
import rough from 'roughjs'



export function handleshapes(
  rcs:RoughCanvas,
  shape: Typetool,
  ctx: CanvasRenderingContext2D | null,
  myMouseX: number,
  myMouseY: number,
  width: number,
  height: number,
  endX: number,
  endY: number
) {
  if (!ctx) {
    console.log("ctx is not reaching to handleshapes");
    return;
  }

  ctx.beginPath();

  switch (shape) {
    case "rectangle":
      rcs.rectangle(myMouseX, myMouseY, width, height);
      break;

    case "circle":
     rcs.circle(myMouseX, myMouseY, Math.abs(height));
      break;

    case "elipse":
      rcs.ellipse(myMouseX, myMouseY, Math.abs(width), Math.abs(height));
      break;

    case "line":
      rcs.line(myMouseX, myMouseY, endX, endY)
      break;

    case "pencil":
      rcs.line(myMouseX, myMouseY, endX, endY);
     
      break;


    case "select":
      console.log("select");
      break;

    default:
      console.log("no shape matched");
  }
}
