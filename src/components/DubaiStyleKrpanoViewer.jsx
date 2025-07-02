import React, { useEffect, useRef, useState } from "react";

// Where all your scene XMLs are stored
const SCENE_BASE_PATH = "/AirportTerminal/tour.xml"; // e.g., /panos/scene001.xml
const DEFAULT_SCENE_ID = "001";
const DubaiStyleKrpanoViewer = () => {
  const containerRef = useRef(null);
  const [sceneId, setSceneId] = useState(SCENE_BASE_PATH);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    window.showPlaceInfo = (name) => {
      alert('Hostport clicked')
      setSceneId('/ConcourseD/tour.xml')
    };
  }, []);
  // KRpano loader (on mount and sceneId change)
  useEffect(() => {
    if (!window.embedpano) {
      console.error("KRpano script not loaded.");
      return;
    }

    setIsLoading(true);

    window.embedpano({
      id: "krpano",
      target: containerRef.current,
      html5: "only",
      mobilescale: 1.0,
      //   xml: `${SCENE_BASE_PATH}/scene${sceneId}.xml`,
      xml: `${sceneId}`,
      onready: (krpano) => {
        console.log(`Scene ${sceneId} loaded`);
        setIsLoading(false);
      },
    });

    const krpano = window.krpano;
    if (!krpano) {
      console.error("KRpano is not ready yet.");
      return;
    }
    const name = "dynamicSpot" + Date.now();
    const url = "/AirportTerminal/hotspots/myicon.gif";

    krpano.call(`addhotspot(${name});`);
    krpano.call(`set(hotspot[${name}].url, ${url});`);
    // krpano.call(`set(hotspot[${name}].style, 'hotspot_html');`);
    // krpano.call(`set(hotspot[${name}].text, '<div>My HTML Hotspot</div>');`);
    krpano.call(`set(hotspot[${name}].text, 'My Tooltip Text');`);
    krpano.call(`set(hotspot[${name}].ath, 5);`);
    krpano.call(`set(hotspot[${name}].atv, -5);`);
    krpano.call(`set(hotspot[${name}].scale, 0.5);`);
    krpano.call(`set(hotspot[${name}].depth, 2000);`);
    krpano.call(`set(hotspot[${name}].onclick, js(showPlaceInfo('${name}')));`);

    return () => {
      if (window.removepano) window.removepano("krpano");
    };
  }, [sceneId]);

  // Transition handler
  const handleSceneChange = (xmlFile) => {
    const krpano = window.krpano;
    // if (!krpano || newSceneId === sceneId) return;

    setIsTransitioning(true);

    // Step 1: Zoom out and fade
    krpano.call("tween(view.fov, 150, 1.0);");
    setTimeout(() => {
      // Step 2: Load new scene with blend
      setIsLoading(true);
      krpano.call(`loadpano(${xmlFile}, null, MERGE, BLEND(1));`);
      setSceneId(xmlFile);

      // Step 3: Wait and fade in
      setTimeout(() => {
        setIsTransitioning(false);
        krpano.call("tween(view.fov, 90, 1.0);"); // Reset FOV
        setIsLoading(false);
      }, 2500);
    }, 1000);
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* KRpano container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Fade Transition Overlay */}
      <div
        className={`absolute top-0 left-0 w-full h-full bg-black z-40 pointer-events-none transition-opacity duration-1000 ${
          isTransitioning ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Spinner */}
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default DubaiStyleKrpanoViewer;
