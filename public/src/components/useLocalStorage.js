import { useState , useEffect } from 'react'

function getSetValue (key,initValue) {
  const savedValue = JSON.parse(localStorage.getItem(key));
  if(savedValue) return savedValue
  if(initValue instanceof Function) return initValue()
  return initValue
}

export default function useLocalStorage(key,initValue) {
  const [value,setValue] = useState(()=>{
    return getSetValue(key,initValue)
  })

  useEffect(()=>{
    localStorage.setItem(key,JSON.parse(value))
  },[value])


  return [value,setValue]
}
