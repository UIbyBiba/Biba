import Navigation from "./components/Navigation";
import Gallery from "./components/Gallery";
import GalleryMobile from "./components/GalleryMobile";
import Cursor from "./components/Cursor";
import { useMediaQuery } from "./hooks/useMediaQuery";
import "./App.css";

export default function App() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="page">
      <Cursor />
      <Navigation isMobile={isMobile} />
      <main className="page__body">
        {isMobile ? <GalleryMobile /> : <Gallery />}
      </main>
    </div>
  );
}
