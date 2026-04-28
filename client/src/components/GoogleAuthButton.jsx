import React, { useEffect, useRef, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { N } from '../styles/theme';

let initializedClientId = null;
let credentialCallbackRef = null;

const GoogleAuthButton = ({ onCredential, text = 'signin_with', label = 'Continue with Google' }) => {
  const buttonRef = useRef(null);
  const [ready, setReady] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    credentialCallbackRef = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!clientId || !window.google?.accounts?.id || !buttonRef.current) {
      return;
    }

    // React StrictMode runs effects twice in development; initialize GSI only once per client id.
    if (initializedClientId !== clientId) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: ({ credential }) => credentialCallbackRef?.(credential),
      });
      initializedClientId = clientId;
    }

    buttonRef.current.innerHTML = '';
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      text,
      width: 320,
      shape: 'pill',
    });
    setReady(true);
  }, [clientId, text]);

  if (!clientId) {
    return (
      <button
        type="button"
        disabled
        style={{
          width: '100%',
          padding: '14px 18px',
          borderRadius: '16px',
          background: N.bg,
          boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          color: N.textLight,
          fontWeight: 700,
          cursor: 'not-allowed',
        }}
      >
        <FcGoogle size={22} />
        Add `VITE_GOOGLE_CLIENT_ID` to enable Google sign-in
      </button>
    );
  }

  return (
    <div>
      <div ref={buttonRef} style={{ minHeight: '44px' }} />
      {!ready ? (
        <div
          style={{
            width: '100%',
            padding: '14px 18px',
            borderRadius: '16px',
            background: N.bg,
            boxShadow: 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            color: N.textLight,
            fontWeight: 700,
            marginTop: '8px',
          }}
        >
          <FcGoogle size={22} />
          {label}
        </div>
      ) : null}
    </div>
  );
};

export default GoogleAuthButton;





