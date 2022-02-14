//imported to ChatBody
import { useState , useEffect , useContext , useRef} from "react";
import { useMessage } from "../context/MessageContext";
import { SocketContext } from "../context/SocketContext";
import { FiSend } from "react-icons/fi";

const Chat = ({themeValue}) => {
  const [inputValue,setInputValue] = useState('');
  const socket = useContext(SocketContext)
  const { displayMessage , USER , currMessage , chatMsg , messages} = useMessage();
  const scrollRef = useRef();

  useEffect(()=>{
    scrollRef.current.scrollTo(0,scrollRef.current.scrollHeight + 20);
  })
  
  function handleMessage(e){
    e.preventDefault();
    if(inputValue.length === 0) return
    let time = new Date();
    function pad(value) {
      if(value < 10) {
        return '0' + value;
      } else {
        return value;
      }
    };
    if(!currMessage) return
    let formatedData = {
      sentFrom:{
        username:USER.username,
        id:USER.id,
        color:USER.color
      },
      recipient:{
        id:currMessage.id
      },
      msg:inputValue.charAt(0).toUpperCase() + inputValue.slice(1),
      time:pad(time.getHours()) + ":" + pad(time.getMinutes()),
    };
    displayMessage(formatedData);
    setInputValue('');
  }

  useEffect(()=>{
    socket.on('recived-msg',({sentFrom,recipient,msg,time})=>{
     displayMessage({sentFrom,recipient,msg,time});
    });
    return ()=>{
      socket.off('recived-msg',({sentFrom,recipient,msg,time})=>{
       displayMessage({sentFrom,recipient,msg,time});
      });
    }
  },[])

  return (
    <div className={!themeValue?'chat':'chat dark'}>
      <div className="parent">
        <div className="messages_wraper">
          <div ref={scrollRef} className="messages_holder">
            <div className="messages">

              {chatMsg.map(item=>{
                return (
                  <div key={Math.random()} className={item.recipient.id === USER.id?'message recived':'message send'}>
                    {item.text.map(text=>{
                      return(
                        <div key={Math.random()} className="message_text">
                          <p>{text.text}</p>
                          <span className="message_time">{text.time} pm</span>
                        </div>
                      )
                    })}
                    <div className="icon_holder">
                      <div className="icon" style={{background:item.sentFrom.color,boxShadow:`0px 0px 3px ${item.sentFrom.color}`}}></div>
                    </div>
                  </div>
                )
              })}
              


            </div>
          </div>
        </div>

        <form onSubmit={handleMessage} className="typing_wraper flex_middle">
          <div className="input_wraper">
            <div className="input_holder">
              <input onChange={(e)=>{setInputValue(e.target.value)}} value={inputValue} type="text" placeholder="Write a reply"/>
            </div>
            <div className="button_holder flex_middle">
              <button type="submit" className="button flex_middle"><FiSend className="icon-svg"/></button>
            </div>
          </div>
        </form>

      </div>
    </div>
  )
}

export default Chat