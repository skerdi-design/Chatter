//imported to ChatBody
import { useState } from "react"
import { TiPlus } from "react-icons/ti";
import { useMessage } from "../context/MessageContext";

const FindUsers = ({themeValue}) => {
  const {USER,avaliableUsers,addMessage} = useMessage();
  const [input,setInput] = useState('');

  function handleSearch (e) {
    e.preventDefault();
  }
  function handleAddFriend(user) {
    addMessage(user)
    setInput('')
  }

  return (
    <div className={!themeValue?"find_users":'find_users dark'}>
      <div className="parent">

        <div className="user_section flex_middle">
          <div className="user_wraper">
            <div className="icon_holder flex_middle">
              <div className="icon" style={{background:USER && USER.color,boxShadow:`0px 0px 3px ${USER.color}`}}></div>
            </div>
            <div className="name_holder flex_middle">
              <p className="name">{USER && USER.username}</p>
            </div>
          </div>
        </div>

        <div className="search_section">
          <div className="search_wraper">

            <div className="input_holder flex_middle">
              <form onSubmit={handleSearch} className="input_container">
                <div className="input">
                  <input autoComplete="off" onChange={(e)=>setInput(e.target.value)} value={input} type="text" id="search" placeholder="Find Users"/>
                </div>
                <div className="button_container flex_middle">
                  <button type="submit" className="button"></button>
                </div>
              </form>
            </div>


            <div className="output_holder">
              <div className="output_wraper">

                {avaliableUsers && avaliableUsers.filter((user)=>{
                  if(input.length === 0){
                    return null;
                  }
                  let regex = new RegExp(`^${input}`, "gi")
                  return user.username.match(regex)
                }).map(item=>{
                  return (
                    <div key={item.id} className="user">
                    <div className="icon" style={{background:item.color,boxShadow:`0px 0px 3px ${item.color}`}}></div>
                    <div className="username">{item.username}</div>
                    <div onClick={()=>handleAddFriend(item)} className="add_wraper flex_middle">
                      <TiPlus className='plus_icon'/>
                    </div>
                  </div>
                  )
                })}

              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}

export default FindUsers