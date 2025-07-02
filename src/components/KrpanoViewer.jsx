// import React, { useEffect, useRef ,useState} from "react";

// const KrpanoViewer = ({ xmlFile = "/vtour/tour.xml" }) => {
//   const containerRef = useRef(null);
//   const [secen ,setSecen] = useState(xmlFile)
  

//   useEffect(() => {
//     window.showPlaceInfo = (name) => {
//       console.log("clicked...")
//       if (window.removepano) window.removepano("krpano");
//       setSecen("/vtour2/tour.xml");
//     };
//   }, []);

//    useEffect(() => {
//     if (!window.embedpano) {
//       console.error("KRpano script not loaded.");
//       return;
//     }
  
//     window.embedpano({
//       id: "krpano",
//       xml: secen,
//       target: containerRef.current,
//       html5: "only",
//       mobilescale: 1.0,
//       onready: function (krpano) {
//         // 1. Add new scene
//         krpano.call("addscene(scene_airport_terminal);");
      
//         // 2. Set title and preview
//         krpano.call("set(scene[scene_airport_terminal].title, 'Airport Terminal');");
//         krpano.call("set(scene[scene_airport_terminal].thumburl, '/vtour2/panos/Airport_Terminal.tiles/thumb.jpg');");
//         krpano.call("set(scene[scene_airport_terminal].preview.url, '/vtour2/panos/Airport_Terminal.tiles/preview.jpg');");
      
//         // 3. Set view parameters
//         krpano.call("set(scene[scene_airport_terminal].view.hlookat, 0.0);");
//         krpano.call("set(scene[scene_airport_terminal].view.vlookat, 0.0);");
//         krpano.call("set(scene[scene_airport_terminal].view.fovtype, 'MFOV');");
//         krpano.call("set(scene[scene_airport_terminal].view.fov, 120);");
//         krpano.call("set(scene[scene_airport_terminal].view.fovmin, 70);");
//         krpano.call("set(scene[scene_airport_terminal].view.fovmax, 140);");
//         krpano.call("set(scene[scene_airport_terminal].view.limitview, 'auto');");
      
//         // 4. Set image source for multires cube
//         krpano.call("set(scene[scene_airport_terminal].image.type, 'CUBE');");
//         krpano.call("set(scene[scene_airport_terminal].image.cube.url, '/vtour2/panos/Airport_Terminal.tiles/%s/l%l/%v/l%l_%s_%v_%h.jpg');");
      
//         // 5. Set multires tile sizes (IMPORTANT!)
//         krpano.call("set(scene[scene_airport_terminal].image.cube.multires, '512,1024,2112');");
//         krpano.call("set(scene[scene_airport_terminal].image.cube.tilesize, 512);"); // Add this!
//         krpano.call("set(scene[scene_airport_terminal].image.cube.baseindex, 0);"); // Optional: default level index
      
//         // 6. Finally, load the scene
//         krpano.call("loadscene(scene_airport_terminal, null, MERGE, BLEND(1));");
//       }
//     })
      
  
//     return () => {
//       if (window.removepano) {
//         window.removepano("krpano");
//       }
//     };
//   }, []); 
  

//   const addHotspot = () => {
//     const krpano = window.krpano;
//     if (!krpano) {
//       console.error("KRpano is not ready yet.");
//       return;
//     }
//     const name = "dynamicSpot" + Date.now();
//     const url = "/vtour/hotspots/myicon.gif";
//     const ath = 10 + Math.random() * 100;
//     const atv = -10 + Math.random() * 20;

//     krpano.call(`addhotspot(${name});`);
//     krpano.call(`set(hotspot[${name}].url, ${url});`);
//     krpano.call(`set(hotspot[${name}].ath, ${ath});`);
//     krpano.call(`set(hotspot[${name}].atv, ${atv});`);
//     krpano.call(`set(hotspot[${name}].scale, 0.5);`);
//     krpano.call(`set(hotspot[${name}].depth, 2000);`);
//     krpano.call(`set(hotspot[${name}].onclick, js(showPlaceInfo('${name}')));`);
//   };
  
//   return (
//     <div className="w-full h-screen relative">
//       <div
//         id="transitionOverlay"
//         className={`absolute top-0 left-0 w-full h-full bg-black transition-opacity duration-1000 pointer-events-none z-50 ${
//           isFading ? "opacity-100" : "opacity-0"
//         }`}
//       />
//       <div
//         id="krpanoContainer"
//         ref={containerRef}
//         className="w-full h-full"
//       ></div>

//       <button
//         onClick={addHotspot}
//         className="absolute top-[4rem] left-[4rem] bg-blue-600 text-white px-4 py-2 rounded shadow"
//       >
//         Add Hotspot
//       </button>
//     </div>
//   );
// };

// export default KrpanoViewer;
