import React , { useState , createContext , useContext , useRef, useEffect } from 'react';
import { SocketContext } from './SocketContext';

export const MessageContext = createContext(null)

async function postFetch(path,body){
  let options = {
    method:"POST",
    headers:{'Content-Type': 'application/json'},
    redirect: 'follow',
    body:JSON.stringify(body)
  };
  let response = await fetch(path,options)
  let data =  await response.json();
  return data;
}

export const MessageProvider = ({ children }) => {
  const socket = useContext(SocketContext);
  const [USER,setUSER] = useState();
  const [avaliableUsers,setAvaliableUsers] = useState();
  const [currMessage,setCurrMessage] = useState();

  const [messages,setMessages] = useState([]);
  const messagesRef = useRef(messages)
  const [chatMsg,setChatMsg] = useState([]);
  const statusRef = useRef();



  const getUserData = (data) => {
    setChatMsg([]);
    setUSER(data.docs)
    let avaUsers = data.data.filter(item=>{
      return item.id !== data.docs.id
    });
    //to remove the friends from avaliableUsers 
    const removedFriends = avaUsers.filter((elem) => !data.docs.messages.find(({ id }) => elem.id === id));
    setAvaliableUsers(removedFriends);
    setMessages(data.docs.messages);
    messagesRef.current = data.docs.messages;
  }





  const updateCurrMessage = (id) => {
    let curr = [...messages].find(item=>{
      return item.id === id
    })
    setCurrMessage(curr);
    let newArray = [...messages]
    newArray.forEach(item => {
      item.active = false;
      if(item.id === id){
        item.active = true;
        setChatMsg(item.conversation);
      }
    })
    setMessages(()=>newArray)
  }



  const addMessage = (user) => {
    let tempUser = {
      username:user.username,
      id:user.id,
      color:user.color,
      status:statusRef.current.find(x=>x===user.id)?true:false,//user.status
      active:false,
      conversation:[]
    }
    postFetch('/addFriend',tempUser)
    .then((res)=>{
      if (res) {
        setAvaliableUsers(()=>{
          return avaliableUsers.filter(item=>{
            return item.id !== user.id
          })
        })
        messagesRef.current.push(tempUser);
        setMessages(prev=>{
          return [...prev,tempUser]
        })
      }
    })
  }





  const updateStatus = (data,{deleted}) => { 
    if(!deleted){
      if(typeof data === "object"){
        statusRef.current = data;
        let newArr = [...messagesRef.current]
        newArr.forEach(item=>{
          if(data.find(x=>x===item.id)){
            item.status = true;
          }
        })
        setMessages(()=>newArr);
      }else{
        statusRef.current.push(data);
        let newArr = [...messagesRef.current]
        newArr.forEach(item=>{
          if(item.id === data){
            item.status = true;
          }
        })
        setMessages(()=>newArr);
      }
    }else{
      const index = statusRef.current.indexOf(data);
      if(index > -1){
        statusRef.current.splice(index,1)
      }
      let newArr = [...messagesRef.current]
        newArr.forEach(item=>{
          if(item.id === data){
            item.status = false;
          }
        })
        setMessages(()=>newArr);
    }
  }


















  const _setMessages = (data) => {
    messagesRef.current.push(data);
    setMessages(messagesRef.current);
  }
  const displayMessage = ({sentFrom,recipient,msg,time}) => {
    let textObj = {
      text:msg,
      time:time
    }
    let msgObj = {
      sentFrom:sentFrom,
      recipient:recipient,
      text:[textObj]
    }
    if(recipient.id === USER.id){//sent to me!!!
      // console.log('sent to me!!!');
      let newArr = [...messagesRef.current];
      let index = messagesRef.current.findIndex(item=>{
        return item.id === sentFrom.id
      })
      if(index === -1){
        // console.log('no user found');
        let tempUser = {
          username:sentFrom.username,
          id:sentFrom.id,
          color:sentFrom.color,
          status:statusRef.current.find(x=>x===sentFrom.id)?true:false,
          active:false,
          conversation:[msgObj]
        }
        setAvaliableUsers(()=>{
          return avaliableUsers.filter(item=>{
            return item.id !== sentFrom.id
          })
        })
        _setMessages(tempUser)
      }else{
        if(newArr[index].conversation.length === 0){
          newArr[index].conversation.push(msgObj);
          setMessages(newArr);
        }else{
          if(newArr[index].conversation[newArr[index].conversation.length-1].recipient.id === recipient.id){
            newArr[index].conversation[newArr[index].conversation.length-1].text.push(textObj);
            setMessages(newArr);
          }else{
            newArr[index].conversation.push(msgObj);
            setMessages(newArr);
          }
        }
      }
    }else{//sent by me!!!
      let newArr = [...messages];
      let index = newArr.findIndex(item=>{
        return item.id === recipient.id;
      })
      if(newArr[index].conversation.length === 0){
        newArr[index].conversation.push(msgObj);
      }else{
        if(newArr[index].conversation[newArr[index].conversation.length-1].recipient.id === recipient.id){
          newArr[index].conversation[newArr[index].conversation.length-1].text.push(textObj);
        }else{
          newArr[index].conversation.push(msgObj);
        }
      }
      socket.emit('send-msg',{sentFrom,recipient,msg,time});
    }
  };














  const value = {getUserData,USER,avaliableUsers,displayMessage,messages,updateCurrMessage,currMessage,addMessage,updateStatus,chatMsg};
  return (
  <MessageContext.Provider value={value}>
    {children}
  </MessageContext.Provider>
  );
}

export const useMessage = () => {
  return useContext(MessageContext)
}