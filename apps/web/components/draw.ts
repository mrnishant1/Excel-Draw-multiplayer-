import { handleshapes } from "./handleshapes";
import { ExistingShape ,Typetool} from "../app/types/tooltype";
import { Undo, Redo, Redostate } from "./undo_redo";
import rough from 'roughjs'


export default function Draw(
  canvas: HTMLCanvasElement,
  socket: WebSocket,
  shape: Typetool,
  existingShapes: ExistingShape[],
  pencilArray: { x: number; y: number }[]
) {

  const ctx = canvas.getContext("2d");
  const rcs = rough.canvas(canvas);
  
  let myMouseX: number | null;
  let myMouseY: number | null;
  let width: number;
  let height: number;
  let endX: number | null = null;
  let endY: number | null = null;
  let isClicked = false;
  let prevX: number;
  let prevY: number;
  let streamPrevX: number | null = null;
  let streamPrevY: number | null = null;
  

  //handle message---> clearcanvas()-------->message handeling----------> store shapes(only when streamer on other side lift the mouse up) --------> map shapes
  const handleMessage = (e: MessageEvent) => {
    const message = JSON.parse(e.data);

    // Draw the incoming shape
    if (ctx) {
      if (message.shape === "pencil") {
        ctx.beginPath();
        if (streamPrevX === null || streamPrevY === null) {
          streamPrevX = message.myMouseX;
          streamPrevY = message.myMouseY;
        }

        //@ts-ignore//
        rcs.line(streamPrevX, streamPrevY, message.endX, message.endY);

        pencilArray.push({ x: message.endX, y: message.endY });
        // Update prev point
        streamPrevX = message.endX;
        streamPrevY = message.endY;

        if (message.mouseUp) {
          console.log("message on mouse up is---------------------- ", message);
          streamPrevX = null;
          streamPrevY = null;
          existingShapes.push({
            shape: "pencil",
            start: { x: message.myMouseX, y: message.myMouseY },
            points: [...pencilArray],
          });
          pencilArray.length = 0;
        }
      }
      
      else {
        cleanupCanvas();
        handleshapes(
          rcs,
          message.shape,
          ctx,
          message.myMouseX,
          message.myMouseY,
          message.width,
          message.height,
          message.endX,
          message.endY
        );
        if (message.mouseUp) {
          existingShapes.push({
            shape: message.shape,
            myMouseX: message.myMouseX,
            myMouseY: message.myMouseY,
            width: message.width,
            height: message.height,
            endX: message.endX,
            endY: message.endY,
          });
        }
      }

      if(message.mouseUp){
        cleanupCanvas();
      }
    }
  };
  //on mousedown-----> isclicked=true;
  const handleMouseDown = (e: MouseEvent) => {
    console.log("mouse down happed ----------------------------------");
    isClicked = true;
    myMouseX = e.clientX + scrollX;
    myMouseY = e.clientY + scrollY;
    // For pencil, initialize prevX/Y separately
    if (shape === "pencil") {
      prevX = myMouseX;
      prevY = myMouseY;
    }
  };

  //on mouseup--------> send mouseup=true;------> record shape.
  const handleMouseUp = () => {
    isClicked = false;
    if (myMouseX == null || myMouseY == null || endX == null || endY == null)
      return;
    console.log("mouse up happed ----------------------------------");
    if (shape === "pencil") {
      existingShapes.push({
        shape: "pencil",
        start: { x: myMouseX, y: myMouseY },
        points: [...pencilArray],
      });
      pencilArray.length = 0;
    }
    //for rest of the shapes store like it
    else {
      existingShapes.push({
        shape,
        myMouseX,
        myMouseY,
        width,
        height,
        endX,
        endY,
      });
    }

    socket.send(
      JSON.stringify({
        shape,
        myMouseX,
        myMouseY,
        width,
        height,
        endX,
        endY,
        mouseUp: true,
      })
    );

    endX = endY = myMouseX = myMouseY = null;
  };
  //on mousemove-------> clearRect + previoushapes--------> handleshape--------> send ovr stream
  const handleMouseMove = (e: MouseEvent) => {
    if (isClicked && ctx) {
      if (myMouseX == null || myMouseY == null) return;
      Redostate() //once mouse moved RedoState = false----> Redostake = [empty]
      width = e.clientX + scrollX - myMouseX;
      height = e.clientY + scrollY - myMouseY;
      endX = e.clientX + scrollX; //current X
      endY = e.clientY + scrollY; //current Y
      console.log(endX, endY);
      console.log(myMouseX, myMouseY);
      if (shape === "pencil") {
        handleshapes(rcs, shape, ctx, prevX, prevY, 0, 0, endX, endY);
        //start stored on mouse up event
        pencilArray.push({ x: endX, y: endY });
        prevX = endX;
        prevY = endY;
      } else {
        cleanupCanvas(); //clearRect + existing shapes handling(redraw all stored shapes)
        handleshapes(rcs, shape, ctx, myMouseX, myMouseY, width, height, endX, endY);
      }
      //send shapes As Messages-------------------------
      socket.send(
        JSON.stringify({
          shape,
          myMouseX,
          myMouseY,
          width,
          height,
          endX,
          endY,
          mouseUp: false,
        })
      );
    }
  };

  function cleanupCanvas() {
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      existingShapes.forEach((element) => {
        if (element.shape === "pencil") {
          ctx.beginPath();
          ctx.moveTo(element.start.x, element.start.y);
          element.points.forEach((element) => {
            ctx.lineTo(element.x, element.y);
          });
          ctx.stroke();
        } else {
          handleshapes(
            rcs,
            element.shape,
            ctx,
            element.myMouseX,
            element.myMouseY,
            element.width,
            element.height,
            element.endX ?? 0,
            element.endY ?? 0
          );
        }
      });
    }
  }
  const handleUndoRedo = (e:KeyboardEvent) => {
    console.log('undo / redo happened --------------')
    if (e.ctrlKey && e.key === "z") {
      e.preventDefault();
      Undo(existingShapes, cleanupCanvas)
    }
    if (e.ctrlKey && e.key === "y") {
      e.preventDefault();
      Redo(existingShapes, cleanupCanvas)
    }
  }

  // Attach listeners
  socket.addEventListener("message", handleMessage);
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("keydown", handleUndoRedo);


  // Return cleanup
  return () => {
    socket.removeEventListener("message", handleMessage);
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener('keydown', handleUndoRedo )
  };
}
