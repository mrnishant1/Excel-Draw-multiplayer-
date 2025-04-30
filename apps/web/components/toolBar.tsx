import { Typetool } from "../app/types/tooltype";
import { useShape } from "../contextAPI/shapeContext";
interface ToolbarProps {
  setShape: (tool: Typetool | null) => void;
}
// export default function Toolbar({setShape}:ToolbarProps) {
export default function Toolbar() {
  //global context = setShape
   const { shape, setShape } = useShape();
  
  return (
    
    <div className="flex flex-row justify-evenly">
      <button onClick={() => {setShape ("rectangle")}}>rectangle</button>
      <button onClick={() => {setShape ("circle")}}>circle</button>
      <button onClick={() => {setShape ("elipse")}}>elipse</button>
      <button onClick={() => {setShape ("line")}}>line</button>
      <button onClick={() => {setShape ("pencil")}}>pencil</button>
      <button onClick={() => {setShape ("select")}}>select</button>
    </div>
  );
}
