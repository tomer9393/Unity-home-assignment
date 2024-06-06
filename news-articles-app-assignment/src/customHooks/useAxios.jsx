import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// custom hook for making HTTP requests with Axios
const useAxios = (config) => {

  // state to manage loading state of the request
  const [loading, setLoading] = useState(false);

  // ref to store the abort controller instance
  const abortControllerRef = useRef(null);

  // fetch data asynchronously
  const fetchData = async (page) => {

    // set loading state to true when fetching data
    setLoading(true);

    // abort the previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // create a new AbortController instance and get its signal
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      // configure the request with the signal and page params if provided
      const requestConfig = { ...config, signal };
      if (page !== undefined) {
        requestConfig.params = { ...config.params, page };
      }
      // send the request using Axios and return the data
      const result = await axios(requestConfig);
      return result.data;
    } catch (error) {
      // handle cancellation and other errors
      if (axios.isCancel(error)) {
        console.error('Request canceled:', error.message);
        return error.message;
      } else {
        throw new Error("Failed to fetch", error);
      }
    } finally {
      // set loading state to false when request is completed
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cleanup function to abort the request when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Return loading state and fetchData function
  return { loading, fetchData };
};

export default useAxios;
