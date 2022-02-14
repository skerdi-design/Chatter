import { useState , useCallback} from 'react';
import {Route,Routes} from 'react-router-dom'
import Wraper from './routes/Wraper'
import Login from './routes/Login';
import Register from './routes/Register';
import PrivateRoute from './components/PrivateRoute';
import PrivateLoginRoute from './components/PrivateLoginRoute';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { MessageProvider } from './context/MessageContext';



function App() {
  const [socketId,setSocketId] = useState('');
  const updateConnection = useCallback((id) =>{
    setSocketId(()=>id)
  },[])

  const updateSocket = useCallback((id) =>{
    setSocketId(()=>false)
  },[])
  return (
    <SocketProvider id={socketId}>
      <MessageProvider>
        <AuthProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={
                <PrivateLoginRoute>
                  <Login />
                </PrivateLoginRoute>
              } />
              <Route path="/register" element={
                <PrivateLoginRoute>
                  <Register />
                </PrivateLoginRoute>
              } />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Wraper updateConnection={updateConnection} updateSocket={updateSocket}/>
                </PrivateRoute>
              }/>
            </Routes>
          </div>
        </AuthProvider>
      </MessageProvider>
    </SocketProvider>
  );
}

export default App;
