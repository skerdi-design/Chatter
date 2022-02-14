//imported to ChatBody
import { useContext , useEffect, useState } from "react"
import { useMessage } from "../context/MessageContext";
import { SocketContext } from "../context/SocketContext";
import { CgArrowsScrollH } from "react-icons/cg";

const Messages = ({themeValue,updateCollapse}) => {
  const socket = useContext(SocketContext);
  const {messages,updateCurrMessage,updateStatus} = useMessage();
  const [collapseState,setCollapseState] = useState(false);

  function handleClick (id) {
    updateCurrMessage(id);
  }

  useEffect(()=>{
    socket.emit('logged')
    socket.on('users-logged',array=>{
      updateStatus(array,{deleted:false});
    })
    socket.on('new-users-logged',id=>{
      updateStatus(id,{deleted:false});
    })
    socket.on('disconnected-users',id=>{
      updateStatus(id,{deleted:true});
    })
  },[])

  function handleCollapse() {
    updateCollapse()
  }
  

  return (
    <div className={!themeValue?'messages':'messages dark'}>
      <div className="parent">

        <div className="text_section">
          <p className="text">ALL MESSAGES</p>
        </div>

        <div className="messages_section">
          <div className="messages_wraper">
            <div className="messages_auto">

              {messages && messages.map(item=>{
                return (
                  <div key={Math.random()} onClick={()=>handleClick(item.id)} className={item.active ? 'message current':'message'}>
                    <div className="border"></div>
                    <div className="icon_holder flex_middle">
                      <div className="icon" style={{background:item.color,boxShadow:`0px 0px 2px ${item.color}`}}></div>
                    </div>
                    <div className="info_holder">
                      <div className="name">
                        <p>{item.username}</p>
                      </div>
                      <div className="state">
                        <p>{item.status?'Online':'Offline'}</p>
                      </div>
                    </div>
                  </div>
                )
              })}

            </div>
          </div>
        </div>


        <div className="collapse_section">
          <div onClick={handleCollapse} className="collapse_wraper">
            <div className="icon_holder flex_middle">
              <div className="icon flex_middle"><CgArrowsScrollH className="icon-svg"/></div>
            </div>
            <p className="text">Collapse</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages