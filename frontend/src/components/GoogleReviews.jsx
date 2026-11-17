import { useEffect } from 'react';

const APP_ID = 'c6ca4a93-50fd-4ed7-889b-a28f487a3192';

export default function GoogleReviews() {
  useEffect(() => {
    const scriptId = 'elfsight-platform-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
      document.body.appendChild(script);
    }
    // Elfsight owns the embedded element after script initialization.
  }, []);
  return <div className={`elfsight-app-${APP_ID}`} data-elfsight-app-lazy />;
}
