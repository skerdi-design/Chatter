import React , { createContext , useEffect , useState } from 'react';
import {io} from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ id , children }) => {
  const[socket , setSocket] = useState(null);

  useEffect(()=>{
    if(id.length !== 0 && id !== false){
      setSocket(io('http://localhost:3002', {query: { id:id } } ))
    }else{
      socket && setSocket(prev=>{
        prev.close();
      })
    }
  },[id])
  return (
  <SocketContext.Provider value={socket}>
    {children}
  </SocketContext.Provider>
  );
}