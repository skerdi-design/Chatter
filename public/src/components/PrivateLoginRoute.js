import React from 'react';
import { useLocation , Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const PrivateLoginRoute = ({children}) => {
  let cookie = Cookies.get('session');
  const location = useLocation();
  
  return cookie ? <Navigate to="/dashboard" state={{from : location}} replace /> : children
  // return children
}

export default PrivateLoginRoute