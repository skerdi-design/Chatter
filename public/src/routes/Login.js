import React , { useRef , useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate , Link} from 'react-router-dom';


const Login = () => {
  const [err,setErr] = useState(false)
  const {logIn} = useAuth();
  const usernameRef = useRef();
  const idRef = useRef();
  const navigate = useNavigate();

  function resetError() {
    setErr(false)
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    logIn(usernameRef.current.value,idRef.current.value)
    .then(res=>{
      if(res){
        navigate('/dashboard');
      }else{
        setErr(true);
      }
    })
  }

  return (
    <div className='login'>
      <div onClick={resetError} className="parent flex_middle">
        <div className="background_svg"></div>
        <div className="form_wraper">

          <form onSubmit={handleSubmit} className='form flex_middle'>
            <div className="section">
              <h2 className="text">Login <span>Form</span></h2>
            </div>
            <div className={err?'section error':'section'}>
              <span className="err_msg">Wrong Username</span>
              <input type="text" ref={usernameRef} placeholder='Username' required/>
            </div>
            <div className={err?'section error':'section'}>
              <span className="err_msg">Wrong Id</span>
              <input type="text" ref={idRef} placeholder='#Id - Of length 7 Example:(#573451)' minLength="7" maxLength="7" required/>
            </div>
            <div className="section">
              <button type="submit" className='btn'>Login</button>
              <Link to={'/register'} type="submit" className='btn'>Create Account</Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Login;