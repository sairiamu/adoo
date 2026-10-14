import React, { useState, useRef, useEffect } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { IconButton } from "../../ui";
import { Grid, Shield, ZoomIn, ZoomOut, Maximize2 } from "../../ui/icons";

export const CanvasOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    project,
    activeSceneId,
    selectedElementIds,
    setSelection,
    updateElement,
  } = useEditorStore();

  const activeScene = project.scenes.find((s) => s.id === activeSceneId) || project.scenes[0];
  const compWidth = project.meta.width;
  const compHeight = project.meta.height;

  const containerRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoomState] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const [gridEnabled, setGridEnabled] = useState(false);
  const [safeAreaEnabled, setSafeAreaEnabled] = useState(true);

  const [activeInteraction, setActiveInteraction] = useState<{
    type: "drag" | "resize" | "rotate";
    elementId?: string;
    handle?: string;
    startX: number;
    startY: number;
    initials: Record<string, { x: number; y: number; width: number; height: number; rotation: number }>;
  } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isSpacePressed && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        setIsSpacePressed(true);
      }

      if (selectedElementIds.length > 0 && activeScene && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        const step = e.shiftKey ? 10 : 1;
        let dx = 0;
        let dy = 0;
        if (e.key === "ArrowLeft") dx = -step;
        if (e.key === "ArrowRight") dx = step;
        if (e.key === "ArrowUp") dy = -step;
        if (e.key === "ArrowDown") dy = step;

        if (dx !== 0 || dy !== 0) {
          e.preventDefault();
          for (const elId of selectedElementIds) {
            const el = activeScene.elements.find((el) => el.id === elId);
            if (el) {
              updateElement(activeScene.id, elId, { x: el.x + dx, y: el.y + dy });
            }
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isSpacePressed, selectedElementIds, activeScene, updateElement]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      setZoomState((prev) => Math.max(0.25, Math.min(4, prev * zoomFactor)));
    } else {
      setPan((prev) => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSpacePressed || e.button === 1 || e.target === containerRef.current) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      if (e.target === containerRef.current && !e.shiftKey) {
        setSelection([]);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }

    if (!activeInteraction || !activeScene) return;

    const dx = (e.clientX - activeInteraction.startX) / zoom;
    const dy = (e.clientY - activeInteraction.startY) / zoom;

    if (activeInteraction.type === "drag") {
      for (const [elId, init] of Object.entries(activeInteraction.initials)) {
        updateElement(activeScene.id, elId, {
          x: Math.round(init.x + dx),
          y: Math.round(init.y + dy),
        });
      }
    } else if (activeInteraction.type === "resize" && activeInteraction.elementId && activeInteraction.handle) {
      const init = activeInteraction.initials[activeInteraction.elementId];
      if (init) {
        let newW = init.width;
        let newH = init.height;
        let newX = init.x;
        let newY = init.y;

        const h = activeInteraction.handle;
        if (h.includes("r")) newW = Math.max(20, init.width + dx);
        if (h.includes("b")) newH = Math.max(20, init.height + dy);
        if (h.includes("l")) {
          const possibleW = init.width - dx;
          if (possibleW > 20) {
            newW = possibleW;
            newX = init.x + dx;
          }
        }
        if (h.includes("t")) {
          const possibleH = init.height - dy;
          if (possibleH > 20) {
            newH = possibleH;
            newY = init.y + dy;
          }
        }

        updateElement(activeScene.id, activeInteraction.elementId, {
          x: Math.round(newX),
          y: Math.round(newY),
          width: Math.round(newW),
          height: Math.round(newH),
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setActiveInteraction(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 flex items-center justify-center overflow-hidden bg-[var(--clay-raised-bg)] select-none cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Canvas Viewport Toolbar */}
      <div className="absolute top-4 right-4 z-30 flex gap-2 items-center bg-[var(--clay-surface)] p-1.5 rounded-2xl shadow-[var(--clay-raised)]">
        <IconButton title="Toggle Grid" active={gridEnabled} onClick={() => setGridEnabled(!gridEnabled)}>
          <Grid size={16} />
        </IconButton>
        <IconButton title="Toggle Safe Area Overlay" active={safeAreaEnabled} onClick={() => setSafeAreaEnabled(!safeAreaEnabled)}>
          <Shield size={16} />
        </IconButton>
        <div className="h-4 w-[1px] bg-[var(--clay-300)]" />
        <IconButton title="Zoom In" onClick={() => setZoomState((z) => Math.min(4, z * 1.25))}>
          <ZoomIn size={16} />
        </IconButton>
        <span className="text-xs font-mono font-bold px-2">{Math.round(zoom * 100)}%</span>
        <IconButton title="Zoom Out" onClick={() => setZoomState((z) => Math.max(0.25, z / 1.25))}>
          <ZoomOut size={16} />
        </IconButton>
        <IconButton title="Reset Zoom" onClick={() => { setZoomState(1); setPan({ x: 0, y: 0 }); }}>
          <Maximize2 size={16} />
        </IconButton>
      </div>

      {/* Scaled & Panned Canvas Artboard Container */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          width: `${compWidth}px`,
          height: `${compHeight}px`,
        }}
        className="relative shadow-2xl rounded-2xl overflow-hidden bg-black transition-transform duration-75"
      >
        {children}

        {/* Grid Overlay */}
        {gridEnabled && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        )}

        {/* Reels / Shorts Safe-Area Overlay */}
        {safeAreaEnabled && (
          <div className="absolute inset-0 pointer-events-none border-[3px] border-dashed border-red-500/40 m-[120px_60px]" style={{ zIndex: 40 }}>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-red-400 bg-black/60 px-2 py-0.5 rounded">
              Reel / Shorts Safe Area (Keep UI & Text inside)
            </div>
          </div>
        )}

        {/* Direct Manipulation Selection & Resize Handles Overlay */}
        <div className="absolute inset-0 pointer-events-auto" style={{ zIndex: 50 }}>
          {activeScene?.elements.map((el) => {
            const isSelected = selectedElementIds.includes(el.id);
            return (
              <div
                key={el.id}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  if (e.shiftKey) {
                    setSelection(
                      isSelected
                        ? selectedElementIds.filter((id) => id !== el.id)
                        : [...selectedElementIds, el.id]
                    );
                  } else {
                    setSelection([el.id]);
                  }

                  setActiveInteraction({
                    type: "drag",
                    startX: e.clientX,
                    startY: e.clientY,
                    initials: {
                      [el.id]: { x: el.x, y: el.y, width: el.width, height: el.height, rotation: el.rotation },
                    },
                  });
                }}
                style={{
                  position: "absolute",
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  transform: `rotate(${el.rotation}deg)`,
                  cursor: "move",
                }}
                className={`absolute group ${isSelected ? "ring-2 ring-blue-500 bg-blue-500/10" : "hover:ring-1 hover:ring-blue-400/50"}`}
              >
                {isSelected && (
                  <>
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setActiveInteraction({
                          type: "resize",
                          elementId: el.id,
                          handle: "tl",
                          startX: e.clientX,
                          startY: e.clientY,
                          initials: { [el.id]: { x: el.x, y: el.y, width: el.width, height: el.height, rotation: el.rotation } },
                        });
                      }}
                      className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-nwse-resize"
                    />
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setActiveInteraction({
                          type: "resize",
                          elementId: el.id,
                          handle: "tr",
                          startX: e.clientX,
                          startY: e.clientY,
                          initials: { [el.id]: { x: el.x, y: el.y, width: el.width, height: el.height, rotation: el.rotation } },
                        });
                      }}
                      className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-nesw-resize"
                    />
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setActiveInteraction({
                          type: "resize",
                          elementId: el.id,
                          handle: "bl",
                          startX: e.clientX,
                          startY: e.clientY,
                          initials: { [el.id]: { x: el.x, y: el.y, width: el.width, height: el.height, rotation: el.rotation } },
                        });
                      }}
                      className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-nesw-resize"
                    />
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setActiveInteraction({
                          type: "resize",
                          elementId: el.id,
                          handle: "br",
                          startX: e.clientX,
                          startY: e.clientY,
                          initials: { [el.id]: { x: el.x, y: el.y, width: el.width, height: el.height, rotation: el.rotation } },
                        });
                      }}
                      className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-nwse-resize"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
