export type Typetool = "rectangle" | "circle" | "elipse" | "line" | "pencil" | "select";

  interface BaseShape {
    shape: Typetool;
  }
  
  interface PencilShape extends BaseShape {
    shape: "pencil";
    start: {x:number, y:number};
    points: { x: number; y: number }[];
  }
  
  interface NormalShape extends BaseShape {
    shape: Exclude<Typetool, "pencil">;
    myMouseX: number;
    myMouseY: number;
    width: number;
    height: number;
    endX: number|null;
    endY: number|null;
  }
  
export  type ExistingShape = PencilShape | NormalShape;
  