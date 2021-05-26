import { useState, useEffect } from 'react';

export const useFetch = (url, options) => {
  const [state, set_state] = useState({ data: null, loading: true });

  useEffect(()=> {
    const request = async () => {
      set_state({ data: null, loading: true });

      try {
        const response = await fetch(url, options);
        if (response.ok) {
            const text = await response.text();
            const json = JSON.parse(
              text.slice(text.indexOf('"') + 1, text.lastIndexOf('"'))
            );
            set_state({ data: json, loading: false });
            console.log(url, response, json);
        }
      } catch(error) { 
        console.log(url, error);
      }
    } 
    request();
  }, [url, options, set_state]);  
  
  return state;
}

