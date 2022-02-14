import React from 'react';
import { useLocation , Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const PrivateRoute = ({children}) => {
  let cookie = Cookies.get('session');
  const location = useLocation();

  return cookie ? children : <Navigate to="/" replace state={{from : location}}/>
  // return children
}

export default PrivateRoute