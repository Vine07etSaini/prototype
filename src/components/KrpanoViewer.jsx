import React, { useEffect, useRef } from "react";

const KrpanoViewer = ({ xmlFile = "/vtour/tour.xml" }) => {
  const containerRef = useRef(null);
  

  useEffect(() => {
    window.showPlaceInfo = (name) => {
      alert(`Hotspot clicked: ${name}`);
      // You can do more here!
    };
  }, []);

  // Load KRpano on mount
  useEffect(() => {
    if (!window.embedpano) {
      console.error("KRpano script not loaded.");
      return;
    }

    window.embedpano({
      id: "krpano",
      xml: xmlFile,
      target: containerRef.current,
      html5: "only",
      mobilescale: 1.0,
    });

    return () => {
      if (window.removepano) {
        window.removepano("krpano");
      }
    };
  }, [xmlFile]);

  // Function to add a dynamic hotspot
  const addHotspot = () => {
    const krpano = window.krpano;
    if (!krpano) {
      console.error("KRpano is not ready yet.");
      return;
    }

    const name = "dynamicSpot" + Date.now();
    const url = "/vtour/hotspots/myicon.gif"; // Make sure this is in /public
    const ath = 10 + Math.random() * 100;
    const atv = -10 + Math.random() * 20;

    krpano.call(`addhotspot(${name});`);
    krpano.call(`set(hotspot[${name}].url, ${url});`);
    krpano.call(`set(hotspot[${name}].ath, ${ath});`);
    krpano.call(`set(hotspot[${name}].atv, ${atv});`);
    krpano.call(`set(hotspot[${name}].scale, 0.5);`);
    krpano.call(`set(hotspot[${name}].onclick, js(showPlaceInfo('${name}')));`);4

  };

  return (
    <div className="w-full h-screen relative">
      <div
        id="krpanoContainer"
        ref={containerRef}
        className="w-full h-full"
      ></div>

      <button
        onClick={addHotspot}
        className="absolute top-[4rem] left-[4rem] bg-blue-600 text-white px-4 py-2 rounded shadow"
      >
        Add Hotspot
      </button>
    </div>
  );
};

export default KrpanoViewer;

