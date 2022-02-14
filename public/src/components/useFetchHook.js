import { useEffect, useState } from 'react';

export default function useFetchHook(url) {
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async() => {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      setResult(() => {
        return data
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(()=>{
    getData();
  },[url])

  return {result,error,isLoading}
}
