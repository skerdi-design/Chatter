import React , { createContext , useContext } from 'react';

export const AuthContext = createContext(null)

async function postFetch(path,body){
  let options = {
    method:"POST",
    headers:{'Content-Type': 'application/json'},
    redirect: 'follow',
    body:JSON.stringify(body)
  };
  let response = await fetch(path,options)
  let data =  await response.json();
  return data;
}

export const AuthProvider = ({ children }) => {
  const logIn = (username,id) => {
    return new Promise ((res,rej) =>{
      postFetch('/login',{username:username,id:id})
      .then(response=>{
        if(response){
          res(response)
        }else{
          res(false)
        }
      })
      .catch(err=>{
        rej(err)
      })
    })
  }
  const signOut = () => {
    return new Promise ((res,rej) =>{
      fetch('/signout')
      .then(response=>response.json())
      .then(json=>{
        if(json){
          res(true)
        }else{
          res(false)
        }
      })
      .catch(err=>{
        rej(err)
      })
    })
  }
  const register = (username,id,color) => {
    return new Promise ((res,rej) =>{
      postFetch('/register',{username:username,id:id,color:color})
      .then(json=>{
        if(json){
          res(json)
        }else{
          res(false)
        }
      })
      .catch(err=>{
        rej(err)
      })
    })
  }

  const value = {logIn, register, signOut};

  return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext)
}