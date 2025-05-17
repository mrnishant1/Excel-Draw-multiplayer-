import { useState, useEffect } from "react";
export function useSocket(roomid:string){
let [socket, setsocket]= useState<WebSocket>();
let [loading, setloading]= useState<boolean>(true);

  useEffect(()=>{
    const ws = new WebSocket(`ws://localhost:8080/${roomid}`)
    ws.onopen = () => { 
        setsocket(ws); 
        setloading(false);
    }
    
  },[])
  return {socket, loading}
}