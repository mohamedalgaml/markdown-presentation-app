import { useEffect } from 'react';

function useHotkeys(key, callback) {
  useEffect(() => {
    const handler = (event) => {
      const target = event.target;
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (!isTyping && event.key.toLowerCase() === key.toLowerCase()) {
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback]);
}

export default useHotkeys;
