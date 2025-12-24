import { useEffect, useRef } from 'react';

const GoogleSignInButton = ({ onSuccess, onError, text = 'Sign in with Google' }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      onError(new Error('Google Client ID not configured'));
      return;
    }

    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            const base64Url = response.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            const userInfo = JSON.parse(jsonPayload);
            onSuccess({ credential: response.credential, user: userInfo });
          }
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          width: '100%'
        });
      } else {
        setTimeout(initGoogle, 100);
      }
    };

    initGoogle();
  }, [onSuccess, onError]);

  return <div ref={buttonRef} className="google-signin-button"></div>;
};

export default GoogleSignInButton;