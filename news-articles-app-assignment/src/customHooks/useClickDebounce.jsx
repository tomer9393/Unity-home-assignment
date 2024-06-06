import { useRef } from 'react';

// custom hook for debouncing click events
const useClickDebounce = (callback, delay) => {
  // ref to track the debounce timeout
  const debounceRef = useRef(null);

  // debounced click handler
  return (...args) => {
    // check if there's an existing debounce timeout
    if (!debounceRef.current) {
      // execute the callback function on the first click
      callback(...args);

      // set a timeout to debounce subsequent clicks
      debounceRef.current = setTimeout(() => {
        // reset the debounceRef after the delay
        debounceRef.current = null;
      }, delay);
    }
  };
};

export default useClickDebounce;
