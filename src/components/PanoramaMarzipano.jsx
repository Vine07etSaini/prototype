import { useEffect, useRef, useState } from "react";
import { RotateCcw, RotateCw, ArrowUp, ArrowDown, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";

// const MIN_FOV = (100 * Math.PI) / 180;  // 30 degrees in radians
// const MAX_FOV = 1024; // 100 degrees in radians
const MIN_FOV = (30 * Math.PI) / 180; // 30 degrees in radians (most zoomed in)
const MAX_FOV = (100 * Math.PI) / 180;

const PanoramaMarzipano = ({ imageUrl, onShubhamHouseClick }) => {
  const containerRef = useRef(null);
  const viewRef = useRef(null);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const autoRotateRef = useRef(null);
  const rotateIntervalRef = useRef(null);
  const zoomIntervalRef = useRef(null);

  // --- Smooth Rotation Handlers ---
  const startRotateLeft = () => {
    rotateIntervalRef.current = setInterval(handleRotateLeft, 16);
  };
  const startRotateRight = () => {
    rotateIntervalRef.current = setInterval(handleRotateRight, 16);
  };
  const startRotateUp = () => {
    rotateIntervalRef.current = setInterval(handleRotateUp, 16);
  };
  const startRotateDown = () => {
    rotateIntervalRef.current = setInterval(handleRotateDown, 16);
  };
  const stopRotate = () => {
    clearInterval(rotateIntervalRef.current);
  };

  // --- Smooth Zoom Handlers ---
  const handleZoomIn = () => {
    if (viewRef.current) {
      const fov = viewRef.current.fov();
      viewRef.current.setFov(Math.max(fov - 1, MIN_FOV));
    }
  };
  const handleZoomOut = () => {
    if (viewRef.current) {
      const fov = viewRef.current.fov();
      viewRef.current.setFov(Math.min(fov + 1, MAX_FOV));
    }
  };
  const startZoomIn = () => {
    zoomIntervalRef.current = setInterval(handleZoomIn, 16);
  };
  const startZoomOut = () => {
    zoomIntervalRef.current = setInterval(handleZoomOut, 16);
  };
  const stopZoom = () => {
    clearInterval(zoomIntervalRef.current);
  };

  // --- Mouse Drag Logic ---
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !viewRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    // Adjust these sensitivity values as needed
    const yaw = viewRef.current.yaw() - dx * 0.005;
    const pitch = viewRef.current.pitch() + dy * 0.005;
    viewRef.current.setYaw(yaw);
    viewRef.current.setPitch(pitch);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // --- Touchpad Pinch/Scroll Zoom ---
  const handleWheel = (e) => {
    if (!viewRef.current) return;
    e.preventDefault();
    const delta = e.deltaY || e.detail || e.wheelDelta;
    const fov = viewRef.current.fov();
    if (delta > 0) {
      viewRef.current.setFov(Math.min(fov + 1, MIN_FOV));
    } else {
      viewRef.current.setFov(Math.max(fov - 1, MAX_FOV));
    }
  };

  useEffect(() => {
    if (!window.Marzipano) {
      console.error("Marzipano not found on window. Check if script loaded.");
      return;
    }

    const viewer = new window.Marzipano.Viewer(containerRef.current);

    const source = window.Marzipano.ImageUrlSource.fromString(imageUrl);

    const geometry = new window.Marzipano.EquirectGeometry([{ width: 4000 }]);

    // Set FOV limits (min: 30deg, max: 100deg)
    const limiter = window.Marzipano.RectilinearView.limit.traditional(
      1024,
      (100 * Math.PI) / 180
    );
    // Set initial FOV to max (less zoomed in)
    const view = new window.Marzipano.RectilinearView(
      { fov: MAX_FOV },
      limiter
    );
    viewRef.current = view;

    const scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true,
    });

    scene.switchTo();

    const hotspotElement = document.createElement("div");
    hotspotElement.className =
      "hotspot flex flex-col items-center cursor-pointer";
    hotspotElement.style.background = "#fff";
    hotspotElement.style.borderRadius = "12px";
    hotspotElement.style.boxShadow = "0 4px 16px rgba(0,0,0,0.18)";
    hotspotElement.style.padding = "12px";
    hotspotElement.style.minWidth = "140px";
    hotspotElement.style.maxWidth = "180px";
    hotspotElement.style.alignItems = "center";

    // Image on top
    const img = document.createElement("img");
    img.src =
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=120&h=80";
    img.alt = "Location";
    img.style.width = "120px";
    img.style.height = "80px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "8px";
    img.style.marginBottom = "10px";
    hotspotElement.appendChild(img);
    // Description at the bottom
    const label = document.createElement("div");
    label.innerText = "Friend's House\nA nice place to visit!";
    label.style.background = "none";
    label.style.color = "#222";
    label.style.padding = "0";
    label.style.borderRadius = "6px";
    label.style.fontSize = "15px";
    label.style.textAlign = "center";
    label.style.marginTop = "0";
    label.style.whiteSpace = "pre-line";
    hotspotElement.appendChild(label);
    hotspotElement.addEventListener("click", () => {
      alert("Hotspot clicked! You can navigate or show more info here.");
    });

    // Position: yaw (left-right), pitch (up-down)
    scene
      .hotspotContainer()
      .createHotspot(hotspotElement, { yaw: 0, pitch: 1 });

    const shubhamHouse = document.createElement("div");
    shubhamHouse.className =
      "hotspot flex flex-col items-center cursor-pointer";
    shubhamHouse.style.background = "#fff";
    shubhamHouse.style.borderRadius = "12px";
    shubhamHouse.style.boxShadow = "0 4px 16px rgba(0,0,0,0.18)";
    shubhamHouse.style.padding = "12px";
    shubhamHouse.style.minWidth = "140px";
    shubhamHouse.style.maxWidth = "180px";
    shubhamHouse.style.alignItems = "center";

    // Image on top
    const houseImg = document.createElement("img");
    houseImg.src =
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=120&h=80";
    houseImg.alt = "Location";
    houseImg.style.width = "120px";
    houseImg.style.height = "80px";
    houseImg.style.objectFit = "cover";
    houseImg.style.borderRadius = "8px";
    houseImg.style.marginBottom = "10px";
    shubhamHouse.appendChild(houseImg);

    const houseLabel = document.createElement("div");
    houseLabel.innerText = "Shubham's House\nA nice place to visit!";
    houseLabel.style.background = "none";
    houseLabel.style.color = "#222";
    houseLabel.style.padding = "0";
    houseLabel.style.borderRadius = "6px";
    houseLabel.style.fontSize = "15px";
    houseLabel.style.textAlign = "center";
    houseLabel.style.marginTop = "0";
    houseLabel.style.whiteSpace = "pre-line";
    shubhamHouse.appendChild(houseLabel);
    // ...existing code...

    shubhamHouse.addEventListener("click", () => {
      if (onShubhamHouseClick) {
        console.log("Shubham's house clicked");
        onShubhamHouseClick();
      }
    });

    scene
      .hotspotContainer()
      .createHotspot(shubhamHouse, { yaw: 1, pitch: 0.2 });

    function handleResize() {
      viewer.resize();
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
      if (rotateIntervalRef.current) clearInterval(rotateIntervalRef.current);
      if (zoomIntervalRef.current) clearInterval(zoomIntervalRef.current);
    };
  }, [imageUrl, onShubhamHouseClick]);

  // Rotate left/right handlers (yaw)
  const handleRotateLeft = () => {
    if (viewRef.current) {
      const yaw = viewRef.current.yaw();
      viewRef.current.setYaw(yaw - 0.04);
    }
  };

  const handleRotateRight = () => {
    if (viewRef.current) {
      const yaw = viewRef.current.yaw();
      viewRef.current.setYaw(yaw + 0.04);
    }
  };

  // Rotate up/down handlers (pitch)
  const handleRotateUp = () => {
    if (viewRef.current) {
      const pitch = viewRef.current.pitch();
      viewRef.current.setPitch(pitch + 0.04);
    }
  };

  const handleRotateDown = () => {
    if (viewRef.current) {
      const pitch = viewRef.current.pitch();
      viewRef.current.setPitch(pitch - 0.04);
    }
  };

  // Auto-rotation handler
  const handleAutoRotate = () => {
    if (isAutoRotating) {
      clearInterval(autoRotateRef.current);
      autoRotateRef.current = null;
      setIsAutoRotating(false);
    } else {
      autoRotateRef.current = setInterval(() => {
        if (viewRef.current) {
          const yaw = viewRef.current.yaw();
          viewRef.current.setYaw(yaw + 0.0007); // Adjust speed as needed
        }
      }, 16); // ~60fps
      setIsAutoRotating(true);
    }
  };

  return (
    <div
      className="w-full h-screen bg-black relative"
    >
      <div
        ref={containerRef}
        className="w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          cursor: isDraggingRef.current ? "grabbing" : "grab",
          overflow: "hidden",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "16px",
          zIndex: 10,
          background: "rgba(0,0,0,0.4)",
          borderRadius: "12px",
          padding: "10px 24px",
        }}
      >
        <button
          onMouseDown={startRotateLeft}
          onMouseUp={stopRotate}
          onMouseLeave={stopRotate}
          onTouchStart={startRotateLeft}
          onTouchEnd={stopRotate}
          onClick={handleRotateLeft}
          style={{ background: "none", border: "none", cursor: "pointer" }}
          title="Rotate Left"
        >
          <RotateCcw size={32} color="white" />
        </button>
        <button
          onMouseDown={startRotateRight}
          onMouseUp={stopRotate}
          onMouseLeave={stopRotate}
          onTouchStart={startRotateRight}
          onTouchEnd={stopRotate}
          onClick={handleRotateRight}
          style={{ background: "none", border: "none", cursor: "pointer" }}
          title="Rotate Right"
        >
          <RotateCw size={32} color="white" />
        </button>
        <button
          onMouseDown={startRotateDown}
          onMouseUp={stopRotate}
          onMouseLeave={stopRotate}
          onTouchStart={startRotateDown}
          onTouchEnd={stopRotate}
          onClick={handleRotateDown}
          style={{ background: "none", border: "none", cursor: "pointer" }}
          title="Rotate Down"
        >
          <ArrowUp size={32} color="white" />
        </button>
        <button
          onMouseDown={startRotateUp}
          onMouseUp={stopRotate}
          onMouseLeave={stopRotate}
          onTouchStart={startRotateUp}
          onTouchEnd={stopRotate}
          onClick={handleRotateUp}
          style={{ background: "none", border: "none", cursor: "pointer" }}
          title="Rotate Up"
        >
          <ArrowDown size={32} color="white" />
        </button>
        <button
          onMouseDown={startZoomIn}
          onMouseUp={stopZoom}
          onMouseLeave={stopZoom}
          onTouchStart={startZoomIn}
          onTouchEnd={stopZoom}
          onClick={handleZoomIn}
          style={{ background: "none", border: "none", cursor: "pointer" }}
          title="Zoom In"
        >
          <ZoomIn size={32} color="white" />
        </button>
        <button
          onMouseDown={startZoomOut}
          onMouseUp={stopZoom}
          onMouseLeave={stopZoom}
          onTouchStart={startZoomOut}
          onTouchEnd={stopZoom}
          onClick={handleZoomOut}
          style={{ background: "none", border: "none", cursor: "pointer" }}
          title="Zoom Out"
        >
          <ZoomOut size={32} color="white" />
        </button>
        <button
          onClick={handleAutoRotate}
          style={{
            background: isAutoRotating ? "#22c55e" : "none",
            border: "none",
            cursor: "pointer",
            borderRadius: "50%",
            transition: "background 0.2s",
          }}
          title={isAutoRotating ? "Stop Tour mode" : "Start Tour mode"}
        >
          <RefreshCw size={32} color="white" />
        </button>
      </div>
    </div>
  );
};

export default PanoramaMarzipano;
