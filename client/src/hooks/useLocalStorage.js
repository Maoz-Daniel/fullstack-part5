import { useState } from 'react'

function resolveInitialValue(initialValue) { // if the initial val is function- call it, otherwise return the value as is
  return typeof initialValue === 'function' ? initialValue() : initialValue
}

export function useLocalStorage(key, initialValue) { //setstorevalue is build in function that update the state, and also cause the component to re-render
  const [storedValue, setStoredValue] = useState(() => { // this cause to run the function only in first render, and not in every render like if we put the code directly in the useState
    const rawValue = window.localStorage.getItem(key) // try to get the value from localStorage

    if (rawValue !== null) {
      try {
        return JSON.parse(rawValue)
      } catch {
        return resolveInitialValue(initialValue)
      }
    }

    return resolveInitialValue(initialValue)
  })

  function setValue(nextValue) {
    setStoredValue((currentValue) => {
      const resolvedValue = // if the next value is a function, call it with the current value, otherwise use the next value directly
        typeof nextValue === 'function' ? nextValue(currentValue) : nextValue 

      window.localStorage.setItem(key, JSON.stringify(resolvedValue))
      return resolvedValue
    })
  }

  function removeValue() { 
    window.localStorage.removeItem(key) 
    setStoredValue(resolveInitialValue(initialValue))
  }

  return [storedValue, setValue, removeValue]
}
