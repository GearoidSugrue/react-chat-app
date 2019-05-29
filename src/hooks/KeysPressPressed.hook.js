import { useState, useEffect } from 'react';

// code based on code here here: https://codesandbox.io/s/y3qzyr3lrz
export default function useKeysPressed() {
  const [keysPressed, setKeyPressed] = useState(new Set([]));

  const keyDownHandler = ({ key }) => setKeyPressed(keysPressed.add(key));

  const keyUpHandler = ({ key }) => {
    keysPressed.delete(key);
    setKeyPressed(keysPressed);
  };

  useEffect(function addKeyListeners() {
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    return function removeKeyListeners() {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  }, []);

  return keysPressed;
}

export function useAreKeysPressed(keys = []) {
  const requiredKeys = new Set(keys);
  const keysPressed = useKeysPressed();

  for (const key of keysPressed) {
    requiredKeys.delete(key);
  }
  return requiredKeys.size === 0;
}
