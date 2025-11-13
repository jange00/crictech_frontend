import { useEffect, useRef, useState } from 'react';

const Typewriter = ({ children, backspace = false, speed = 100, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const timeoutRef = useRef(null);
  const cursorTimeoutRef = useRef(null);
  const isDeletingRef = useRef(false);
  const charIndexRef = useRef(0);

  useEffect(() => {
    // Blinking cursor effect
    const blinkCursor = () => {
      setShowCursor(prev => !prev);
      cursorTimeoutRef.current = setTimeout(blinkCursor, 530);
    };
    cursorTimeoutRef.current = setTimeout(blinkCursor, 530);

    return () => {
      if (cursorTimeoutRef.current) {
        clearTimeout(cursorTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const text = typeof children === 'string' ? children : String(children);
    
    const type = () => {
      if (isDeletingRef.current) {
        // Deleting
        setDisplayText(text.substring(0, charIndexRef.current - 1));
        charIndexRef.current--;
      } else {
        // Typing
        setDisplayText(text.substring(0, charIndexRef.current + 1));
        charIndexRef.current++;
      }

      let typeSpeed = speed;

      if (isDeletingRef.current) {
        typeSpeed = speed / 2; // Faster when deleting
      }

      if (!isDeletingRef.current && charIndexRef.current === text.length) {
        // Finished typing, wait before deleting
        if (backspace === "all" || backspace === true) {
          typeSpeed = 2000; // Wait 2 seconds before deleting
          isDeletingRef.current = true;
        } else {
          // Don't delete, just stop
          return;
        }
      } else if (isDeletingRef.current && charIndexRef.current === 0) {
        // Finished deleting, restart typing
        isDeletingRef.current = false;
        typeSpeed = 500; // Wait before typing again
      }

      timeoutRef.current = setTimeout(type, typeSpeed);
    };

    // Initial delay
    timeoutRef.current = setTimeout(() => {
      type();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [children, backspace, speed, delay]);

  return (
    <span>
      {displayText}
      <span className={showCursor ? 'opacity-100' : 'opacity-0'}>|</span>
    </span>
  );
};

export default Typewriter;
