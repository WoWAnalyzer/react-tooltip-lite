import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

export default function Portal({ children }) {
  const elRef = useRef(null);
  if (!elRef.current) {
    elRef.current = document.createElement('div');
  }

  useEffect(() => {
    const portalRoot = document.getElementById('portal-root');
    if (!portalRoot) {
      return;
    }

    portalRoot.appendChild(elRef.current);
    return () => {
      portalRoot.removeChild(elRef.current);
    };
  }, []);

  return ReactDOM.createPortal(children, elRef.current);
}
