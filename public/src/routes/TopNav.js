//imported to Wraper
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useMessage } from "../context/MessageContext";
import { BsChatLeftDotsFill} from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { HiSun , HiMoon} from "react-icons/hi";

const TopNav = ({updateSocket,toggleTheme,themeValue}) =>{
  const {currMessage} = useMessage();
  const{ signOut } = useAuth();
  const navigate = useNavigate();
  
  function handleLogout() {
    let Data = signOut()
    if(Data){
      Cookies.remove('session')
      updateSocket()
      navigate('/')
    }
  }

  return (
    <div className={!themeValue ? "top_nav":"top_nav dark"}>
      <div className="parent">

        <div className="logo_section">
          <div className="logo_wraper">
            <div className="icon_holder flex_middle">
              <div className="icon flex_middle"><BsChatLeftDotsFill className="icon_svg"/></div>
            </div>
            <div className="name_holder">
              <p className="name">Chatter</p>
            </div>
          </div>
        </div>

        <div className="info_section">
          <div className="current_messages">
            <div className="current_wraper">
              <div className="icon_holder flex_middle">
                <div className="icon" style={{background:currMessage && currMessage.color,boxShadow:`0px 0px 3px ${currMessage && currMessage.color}`}}></div>
              </div>
              <div className="username_holder">
                <p className="username">{currMessage && currMessage.username}</p>
              </div>
            </div>
          </div>

          <div className="options">
            <div className="toggle_holder">
              <input checked={themeValue?'checked':''} type="checkbox" id="light" readOnly/>
              <label onClick={toggleTheme} className="option" htmlFor="light">
                <div className="switch flex_middle">{!themeValue?<HiSun className="icon-svg"/>:<HiMoon className="icon-svg"/>}</div>
              </label>
            </div>
          </div>

        </div>

        <div className="logout_section">
          <div onClick={handleLogout} className="logout_wraper">
            <div className="name_holder">
              <p className="name">Logout</p>
            </div>
            <div className="icon_holder flex_middle">
              <div className="icon flex_middle"><BiLogOut className="icon_svg"/></div>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default TopNav
