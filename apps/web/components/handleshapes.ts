import { Typetool } from "../app/types/tooltype";

export function handleshapes(shape:Typetool, ctx: CanvasRenderingContext2D| null, cordinateX:number, cordinateY:number, width:number, height:number, endX:number, endY:number){
    if(!ctx) return console.log("ctx is not reaching to handleshapes");

    if (shape==="rectangle")
    {
        ( ctx.strokeRect(cordinateX, cordinateY, width, height))
    }
    else if(shape ==="circle"){
        ctx.beginPath()
        ctx.arc(cordinateX, cordinateY, Math.abs(height), 0,2*Math.PI)
        ctx.stroke();
    }
    else if(shape ==="elipse"){
        ctx.beginPath()
        ctx.ellipse(cordinateX, cordinateY, Math.abs(width), Math.abs(height), 0, 0, 2*Math.PI)
        ctx.stroke();
    }
    else if(shape ==="line"){
        ctx.beginPath()
        // Set a start-point
        ctx.moveTo(cordinateX, cordinateY);
        // Set an end-point
        ctx.lineTo(endX, endY);
        ctx.stroke()

    }
    else if(shape ==="pencil"){
        ctx.beginPath();
        ctx.moveTo(cordinateX, cordinateY);
        ctx.moveTo(cordinateX, cordinateY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
    else if(shape ==="select"){
        console.log("select")
    }

    else return console.log("no shape matched")

}
