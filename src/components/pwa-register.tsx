import * as React from "react";

// PWA Service Worker Registration Component
export function PWARegister() {
  React.useEffect(() => {
    // Only register service worker in production and if supported
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    }
  }, []);

  return null;
}
