import { useState } from 'react'
import PanoramaMarzipano from "./components/PanoramaMarzipano";
import './App.css'
import  basicImg from "./assets/base.jpg";
import shubhamHouse from "./assets/shubham.jpg";
import KrpanoViewer from "./components/KrpanoViewer";
function App() {
  const [imageUrl, setImageUrl] = useState(basicImg);
  return (
    <>
      <div className="App">
        {/* Header overlays the panorama */}
        <div className="w-full flex justify-between items-center px-8 py-4 bg-zinc-900 text-white text-xl font-semibold fixed top-0 left-0 z-50">
          <span>Virtual Tour.</span>
          <span className="cursor-pointer">Contact</span>
        </div>
        <KrpanoViewer />
        {/* No pt-20 here */}
        {/* <PanoramaMarzipano
          imageUrl={imageUrl}
          onShubhamHouseClick={() => setImageUrl(shubhamHouse)}
        /> */}
      </div>
    </>
  );
}

export default App
