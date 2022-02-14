import React , { useRef , useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate , Link} from 'react-router-dom'


const Register = () => {
  const [err , setErr] = useState(()=>false);
  const [color] = useState([
    '#FF6969','#FFB697','#FFED8C','#8DDE71','#81FFE1','#4E64DA','#9E62FF','#F156FF','#5B5B5B'
  ])
  const [userColor,setUserColor] = useState()

  const {register} = useAuth();
  const usernameRef = useRef();
  const idRef = useRef();
  const navigate = useNavigate();


  function resetErr () {
    setErr(false);
  }
  const handleRegister = (e) => {
    e.preventDefault();
    register(usernameRef.current.value,idRef.current.value,userColor)
    .then(res=>{
      if(res){
        navigate('/dashboard')
      }else{
        setErr(true);
      }
    })
  };

  return (
    <div className='login'>
      <div className="parent flex_middle">
        <div className="background_svg"></div>
        <div onClick={resetErr} className="form_wraper">

          <form onSubmit={handleRegister} className='form flex_middle'>
            <div className="section">
              <h2 className="text">Registration <span>Form</span></h2>
            </div>
            <div className={err?'section error':'section'}>
              <span className="err_msg">Wrong Username</span>
              <input type="text" placeholder='Username' ref={usernameRef} required/>
            </div>
            <div className={err?'section error':'section'}>
              <span className="err_msg">Wrong Id</span>
              <input type="text" placeholder='#Id - Of length 7 Example:(#573451)' minLength="7" maxLength="7" ref={idRef} required/>
            </div>
            <div className='section colors'>
              {color.map(item=>{
                return (
                  <div key={item} className="inputs flex_middle">
                    <input type="radio" name="color" id={item} required/>
                    <label onClick={()=>setUserColor(item)} htmlFor={item} style={{background:item,outlineColor:item}}></label>
                  </div>
                )
              })}
            </div>
            <div className="section">
              <button type="submit" className='btn'>Create Account</button>
              <Link to={'/'} type="submit" className='btn'>LogIn</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register;