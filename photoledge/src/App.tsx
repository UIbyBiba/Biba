import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import PhotoLedge from "./components/PhotoLedge";
import SplashScreen from "./components/SplashScreen";
import "./App.css";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <PhotoLedge />
      <AnimatePresence>
        {showSplash && (
          // To use your own envelope photos, pass a `photos` array, e.g.
          //   <SplashScreen photos={["/photos/a.jpg", "/photos/b.jpg"]} ... />
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
