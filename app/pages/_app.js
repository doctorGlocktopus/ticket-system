// pages/_app.js
import '@/styles/globals.css'; // Globales CSS
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Optional: Hinzufügen von Logging oder anderen Initialisierungen
  useEffect(() => {
    console.log('App loaded');
  }, []);

  return (
    <>
      {/* Hier können globale Layout-Komponenten oder Provider hinzugefügt werden */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
