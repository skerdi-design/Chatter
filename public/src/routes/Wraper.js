//imported to App
import TopNav from "./TopNav"
import Messages from "./Messages"
import Chat from "./Chat"
import FindUsers  from "./FindUsers"
import { useEffect, useContext , useRef} from 'react'
import { SocketContext } from "../context/SocketContext"
import useFetchHook from "../components/useFetchHook"
import { useMessage } from "../context/MessageContext"
import useLocalStorage from "../components/useLocalStorage"


const Wraper = ({updateConnection,updateSocket}) =>{
  const [themeValue,setThemeValue] = useLocalStorage('react-chat-theme',false)
  const {getUserData} = useMessage()
  const socket = useContext(SocketContext);
  const {result, error, isLoading} = useFetchHook('/data');
  const collapse = useRef();
  function updateCollapse () {
    collapse.current.classList.toggle('collapsed');
  }
  function toggleTheme () {
    setThemeValue(prev=>!prev);
  }
  useEffect(()=>{
    if(result.length !== 0){
      getUserData(result);
      updateConnection(result.docs.id);
    }
    console.log(result,error,isLoading);
  },[result,error,isLoading])
  if(error) return <div>{error}</div>
  if(!socket || isLoading) return <div>Loading!!!</div>
  return (
    <div ref={collapse} className="wraper_container">
      <div  className={!themeValue?'Wraper':'Wraper dark'}>
        <TopNav updateSocket={updateSocket} toggleTheme={toggleTheme} themeValue={themeValue}/>
        <div className="chat_body">
          <Messages themeValue={themeValue} updateCollapse={updateCollapse}/>
          <Chat themeValue={themeValue}/>
          <FindUsers themeValue={themeValue}/>
        </div>
      </div>
    </div>
  )
}

export default Wraper