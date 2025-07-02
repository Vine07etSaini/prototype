import { useState } from 'react'
import './App.css'
import DubaiStyleKrpanoViewer from './components/DubaiStyleKrpanoViewer';
function App() {
  return (
    <>
      <div className="App">
        {/* Header overlays the panorama */}
        <div className="w-full flex justify-between items-center px-8 py-4 bg-zinc-900 text-white text-xl font-semibold fixed top-0 left-0 z-50">
          <span>Virtual Tour.</span>
          <span className="cursor-pointer">Contact</span>
        </div>
        <DubaiStyleKrpanoViewer/>
      </div>
    </>
  );
}

export default App
