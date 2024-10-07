import SocketContext from "./SocketContext";
import {io} from "socket.io-client";
import React, { useContext, useMemo } from 'react';

export const useSocket = ()=>{
    const socket = useContext(SocketContext);
    return socket;
}

const SocketState = (props) => {
    const socket = useMemo(()=> io("/"), []);
  return (
    <div>
      <SocketContext.Provider value={{socket}}>
        {props.children}
      </SocketContext.Provider>
    </div>
  )
}

export default SocketState;
