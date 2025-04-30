import { handleshapes } from "./handleshapes";
import { Typetool } from "../app/types/tooltype";

interface ExistingShape {
    shape: Typetool;
    myMouseX: number;
    myMouseY: number;
    width: number;
    height: number;
    endX: number;
    endY: number;
  }
  

export default function Draw(
  canvas: HTMLCanvasElement,
  socket: WebSocket,
  shape: Typetool
) {
  const ctx = canvas.getContext("2d");
  let myMouseX = 0;
  let myMouseY = 0;
  let remoteX = 0;
  let remoteY = 0;
  let width = 0;
  let height = 0;
  let endX = 0;
  let endY = 0;
  let isClicked = false;
  const existingShapes: ExistingShape[] = [];

  const handleMessage = (e: MessageEvent) => {
    const message = JSON.parse(e.data);
    if (ctx) {
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
      cleanupCanvas()
      handleshapes(
        message.shape,
        ctx,
        message.myMouseX,
        message.myMouseY,
        message.width,
        message.height,
        message.endX,
        message.endY
      );
    //   existingShapes.push({
    //     shape: message.shape,
    //     myMouseX: message.myMouseX,
    //     myMouseY: message.myMouseY,
    //     width: message.width,
    //     height: message.height,
    //     endX: message.endX,
    //     endY: message.endY
    //   });

    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    isClicked = true;
    myMouseX = e.clientX + scrollX;
    myMouseY = e.clientY + scrollY;
  };

  const handleMouseUp = () => {
    isClicked = false;
    existingShapes.push({shape, myMouseX, myMouseY, width, height, endX, endY})
    

  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isClicked && ctx) {
      width = e.clientX + scrollX - myMouseX;
      height = e.clientY + scrollY - myMouseY;
      endX = e.clientX + scrollX;
      endY = e.clientY + scrollY;
      cleanupCanvas()
        
      handleshapes(shape, ctx, myMouseX, myMouseY, width, height, endX, endY);
      socket.send(
        JSON.stringify({
          shape,
          myMouseX,
          myMouseY,
          width,
          height,
          endX,
          endY,
        })
      );
    }
  };

   function cleanupCanvas(){
    if(ctx)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        existingShapes.map(element => {
        handleshapes(element.shape, ctx, element.myMouseX, element.myMouseY, element.width, element.height, element.endX, element.endY)
    });
  }

  // Attach listeners
  socket.addEventListener("message", handleMessage);
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);

  // Return cleanup
  return () => {
    socket.removeEventListener("message", handleMessage);
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("mousemove", handleMouseMove);
  };
}
