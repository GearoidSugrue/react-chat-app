import { useEffect, useState } from 'react';

/**
 * Returns the keys pressed.
 * Modified version of this code: https://codesandbox.io/s/y3qzyr3lrz
 */
export function useKeysPressed(): Set<string> {
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

/**
 * Returns true if all of the provided keys are pressed.
 * @param keys array of keys to check e.g. ['Shift', 'Enter']
 */
export function useAreKeysPressed(keys = []): boolean {
  const requiredKeys = new Set(keys);
  const keysPressed = useKeysPressed();

  for (const key of keysPressed) {
    requiredKeys.delete(key);
  }
  return requiredKeys.size === 0;
}
