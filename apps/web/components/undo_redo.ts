import { ExistingShape } from "../app/types/tooltype";
const RedoStack:ExistingShape[] = [];
export function Undo(existingShapes: ExistingShape[], cleanupCanvas: any) {
    if (existingShapes.length > 0) {
      const previous = existingShapes.pop();
      if (previous) {
        RedoStack.push(previous);
        cleanupCanvas();
      }
    }
  }
  
  export function Redo(existingShapes: ExistingShape[], cleanupCanvas: any) {
    if (RedoStack.length > 0) {
      const current = RedoStack.pop();
      if (current) {
        existingShapes.push(current);
        cleanupCanvas();
      }
    }
  }
  
export function Redostate(){
    RedoStack.length = 0;
}