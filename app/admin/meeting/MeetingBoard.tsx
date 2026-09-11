"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Pencil } from "../../components/icons";

export type BoardType = "blackboard" | "whiteboard";
export type ToolType = "pen" | "highlighter" | "eraser" | "line" | "arrow" | "rect" | "circle" | "text";
export type GridType = "none" | "grid" | "lines";

interface MeetingBoardProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle?: string | null;
}

const BLACKBOARD_COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Yellow", value: "#fef08a" },
  { name: "Cyan", value: "#7dd3fc" },
  { name: "Green", value: "#86efac" },
  { name: "Pink", value: "#f472b6" },
  { name: "Orange", value: "#fb923c" },
];

const WHITEBOARD_COLORS = [
  { name: "Black", value: "#0f172a" },
  { name: "Blue", value: "#1d4ed8" },
  { name: "Red", value: "#b91c1c" },
  { name: "Green", value: "#15803d" },
  { name: "Purple", value: "#7e22ce" },
  { name: "Orange", value: "#ea580c" },
];

const STROKE_SIZES = [
  { label: "S", size: 2 },
  { label: "M", size: 4 },
  { label: "L", size: 8 },
  { label: "XL", size: 14 },
];

export default function MeetingBoard({
  isOpen,
  onClose,
  eventTitle,
}: MeetingBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [boardType, setBoardType] = useState<BoardType>("blackboard");
  const [tool, setTool] = useState<ToolType>("pen");
  const [color, setColor] = useState<string>("#ffffff");
  const [strokeSize, setStrokeSize] = useState<number>(4);
  const [gridType, setGridType] = useState<GridType>("none");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSplitView, setIsSplitView] = useState(false);

  // Undo / Redo history
  const [history, setHistory] = useState<ImageData[]>([]);
  const [redoList, setRedoList] = useState<ImageData[]>([]);

  // Drawing state refs
  const isDrawingRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const snapshotRef = useRef<ImageData | null>(null);

  // Text tool state
  const [textInput, setTextInput] = useState<{
    visible: boolean;
    x: number;
    y: number;
    value: string;
  }>({ visible: false, x: 0, y: 0, value: "" });

  // Update default color when switching board type
  const handleBoardTypeChange = (type: BoardType) => {
    setBoardType(type);
    if (type === "blackboard") {
      setColor("#ffffff");
    } else {
      setColor("#0f172a");
    }
  };

  // Helper to get board background color
  const getBoardBg = useCallback(
    () => (boardType === "blackboard" ? "#192420" : "#ffffff"),
    [boardType]
  );

  // Redraw background grid / lines
  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      if (gridType === "none") return;

      ctx.save();
      const lineColor =
        boardType === "blackboard"
          ? "rgba(255, 255, 255, 0.08)"
          : "rgba(0, 0, 0, 0.07)";
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;

      const step = 32;
      ctx.beginPath();

      if (gridType === "grid") {
        for (let x = step; x < width; x += step) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
      }

      for (let y = step; y < height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }

      ctx.stroke();
      ctx.restore();
    },
    [boardType, gridType]
  );

  // Initialize canvas size and fill background
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const width = Math.max(300, Math.floor(rect.width));
    const height = Math.max(300, Math.floor(rect.height));

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.fillStyle = getBoardBg();
    ctx.fillRect(0, 0, width, height);

    drawGrid(ctx, width, height);

    // Save initial state to history
    const initialImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialImg]);
    setRedoList([]);
  }, [drawGrid, getBoardBg]);

  // Adjust on open or resize
  useEffect(() => {
    if (!isOpen || isMinimized) return;
    const t = setTimeout(() => {
      initCanvas();
    }, 50);

    const handleResize = () => {
      // Re-init canvas on window resize while preserving aspect
      initCanvas();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, isMinimized, initCanvas]);

  // Redraw when boardType changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    ctx.save();
    ctx.fillStyle = getBoardBg();
    ctx.fillRect(0, 0, width, height);
    drawGrid(ctx, width, height);
    ctx.restore();

    setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    setRedoList([]);
  }, [boardType, drawGrid, getBoardBg]);

  // Save current canvas snapshot into history
  const pushHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-25), imgData]);
    setRedoList([]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newHistory = [...history];
    const current = newHistory.pop()!;
    const previous = newHistory[newHistory.length - 1];

    setRedoList((prev) => [current, ...prev]);
    setHistory(newHistory);

    ctx.putImageData(previous, 0, 0);
  };

  const handleRedo = () => {
    if (redoList.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newRedo = [...redoList];
    const next = newRedo.shift()!;

    setHistory((prev) => [...prev, next]);
    setRedoList(newRedo);

    ctx.putImageData(next, 0, 0);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.fillStyle = getBoardBg();
    ctx.fillRect(0, 0, width, height);
    drawGrid(ctx, width, height);

    pushHistory();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${boardType}-notes-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Coordinate helper
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Mouse handlers for drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCoordinates(e);
    startPosRef.current = coords;

    if (tool === "text") {
      setTextInput({
        visible: true,
        x: coords.x,
        y: coords.y,
        value: "",
      });
      return;
    }

    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Save snapshot for shape previews
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.strokeStyle = getBoardBg();
      ctx.lineWidth = strokeSize * 3.5;
    } else if (tool === "highlighter") {
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = strokeSize * 3;
    } else {
      ctx.strokeStyle = color;
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = strokeSize;
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coords = getCoordinates(e);

    if (tool === "pen" || tool === "highlighter" || tool === "eraser") {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (snapshotRef.current) {
      // Shape preview: restore snapshot first
      ctx.putImageData(snapshotRef.current, 0, 0);

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 1.0;

      const sx = startPosRef.current.x;
      const sy = startPosRef.current.y;
      const ex = coords.x;
      const ey = coords.y;

      if (tool === "line") {
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      } else if (tool === "arrow") {
        // Draw line
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // Arrow head
        const angle = Math.atan2(ey - sy, ex - sx);
        const headLen = Math.max(12, strokeSize * 3);
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(
          ex - headLen * Math.cos(angle - Math.PI / 6),
          ey - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(ex, ey);
        ctx.lineTo(
          ex - headLen * Math.cos(angle + Math.PI / 6),
          ey - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      } else if (tool === "rect") {
        ctx.strokeRect(sx, sy, ex - sx, ey - sy);
      } else if (tool === "circle") {
        const radiusX = Math.abs(ex - sx) / 2;
        const radiusY = Math.abs(ey - sy) / 2;
        const centerX = sx + (ex - sx) / 2;
        const centerY = sy + (ey - sy) / 2;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.globalAlpha = 1.0;
    }

    pushHistory();
  };

  // Commit text input onto canvas
  const handleCommitText = () => {
    if (!textInput.value.trim()) {
      setTextInput({ visible: false, x: 0, y: 0, value: "" });
      return;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.font = `${Math.max(16, strokeSize * 4)}px ui-sans-serif, system-ui, sans-serif`;
        ctx.fillStyle = color;
        ctx.fillText(textInput.value, textInput.x, textInput.y + 18);
        pushHistory();
      }
    }
    setTextInput({ visible: false, x: 0, y: 0, value: "" });
  };

  if (!isOpen) return null;

  // Minimized floating widget
  if (isMinimized) {
    return (
      <div className="fixed bottom-24 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 rounded-full border border-teal-500/40 bg-slate-900/90 px-4 py-2.5 text-sm font-semibold text-teal-300 shadow-2xl backdrop-blur-md hover:bg-slate-800 transition-all hover:scale-105"
        >
          <Pencil className="h-4 w-4" />
          <span>Open {boardType === "blackboard" ? "Blackboard" : "Whiteboard"}</span>
        </button>
      </div>
    );
  }

  const activePalette =
    boardType === "blackboard" ? BLACKBOARD_COLORS : WHITEBOARD_COLORS;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isSplitView
          ? "right-0 top-0 h-full w-[55%] border-l border-slate-700/60 shadow-2xl bg-slate-950"
          : "inset-0 flex flex-col bg-slate-950/95 backdrop-blur-md"
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 backdrop-blur">
        <div className="flex items-center gap-3">
          {/* Board Type Switcher */}
          <div className="flex rounded-full bg-slate-800/80 p-1 border border-slate-700/60">
            <button
              type="button"
              onClick={() => handleBoardTypeChange("blackboard")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                boardType === "blackboard"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Blackboard
            </button>
            <button
              type="button"
              onClick={() => handleBoardTypeChange("whiteboard")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                boardType === "whiteboard"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-slate-800" />
              Whiteboard
            </button>
          </div>

          {eventTitle && (
            <span className="hidden text-xs text-slate-400 md:inline">
              · {eventTitle}
            </span>
          )}
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Split view toggle */}
          <button
            type="button"
            onClick={() => setIsSplitView((prev) => !prev)}
            className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title={isSplitView ? "Expand Full Screen" : "Split View with Video"}
          >
            {isSplitView ? "Full Screen" : "Split with Video"}
          </button>

          {/* Minimize */}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title="Minimize board"
          >
            Minimize
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-red-600 hover:text-white transition-colors"
            title="Close board"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Board Canvas Area with Toolbar */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Floating Tools Palette */}
        <div className="absolute left-4 top-4 z-30 flex flex-col gap-2 rounded-2xl border border-slate-700/60 bg-slate-900/90 p-2 text-white shadow-2xl backdrop-blur-md">
          {/* Tool selectors */}
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setTool("pen")}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                tool === "pen"
                  ? "bg-teal-600 text-white shadow"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
              title="Pen / Chalk"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setTool("highlighter")}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                tool === "highlighter"
                  ? "bg-teal-600 text-white shadow"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
              title="Highlighter"
            >
              HL
            </button>

            <button
              type="button"
              onClick={() => setTool("eraser")}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                tool === "eraser"
                  ? "bg-teal-600 text-white shadow"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
              title="Eraser"
            >
              ER
            </button>

            <button
              type="button"
              onClick={() => setTool("line")}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                tool === "line"
                  ? "bg-teal-600 text-white shadow"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
              title="Straight Line"
            >
              /
            </button>

            <button
              type="button"
              onClick={() => setTool("arrow")}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                tool === "arrow"
                  ? "bg-teal-600 text-white shadow"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
              title="Arrow"
            >
              &rarr;
            </button>

            <button
              type="button"
              onClick={() => setTool("rect")}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm transition-all ${
                tool === "rect"
                  ? "bg-teal-600 text-white shadow"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
              title="Rectangle"
            >
              &#9633;
            </button>

            <button
              type="button"
              onClick={() => setTool("circle")}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm transition-all ${
                tool === "circle"
                  ? "bg-teal-600 text-white shadow"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
              title="Circle"
            >
              &#9675;
            </button>

            <button
              type="button"
              onClick={() => setTool("text")}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                tool === "text"
                  ? "bg-teal-600 text-white shadow"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
              title="Text"
            >
              T
            </button>
          </div>

          <div className="my-1 border-t border-slate-700/60" />

          {/* Stroke sizes */}
          <div className="flex flex-col gap-1">
            {STROKE_SIZES.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setStrokeSize(s.size)}
                className={`flex h-7 w-9 items-center justify-center rounded-lg text-[10px] font-bold transition-all ${
                  strokeSize === s.size
                    ? "bg-teal-600/80 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
                title={`Stroke ${s.label}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="my-1 border-t border-slate-700/60" />

          {/* Color palette */}
          <div className="flex flex-col gap-1.5 items-center">
            {activePalette.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                style={{ backgroundColor: c.value }}
                className={`h-5 w-5 rounded-full border transition-transform ${
                  color === c.value
                    ? "scale-125 border-white ring-2 ring-teal-400"
                    : "border-slate-600 hover:scale-110"
                }`}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Top-Right Secondary Controls (Grid, Undo, Redo, Clear, Save) */}
        <div className="absolute right-4 top-4 z-30 flex items-center gap-1.5 rounded-2xl border border-slate-700/60 bg-slate-900/90 p-1.5 text-white shadow-2xl backdrop-blur-md">
          {/* Grid selector */}
          <button
            type="button"
            onClick={() =>
              setGridType((prev) =>
                prev === "none" ? "grid" : prev === "grid" ? "lines" : "none"
              )
            }
            className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title="Toggle Grid / Ruled lines / Plain"
          >
            {gridType === "none"
              ? "Plain"
              : gridType === "grid"
              ? "Grid"
              : "Ruled"}
          </button>

          <div className="h-4 w-px bg-slate-700" />

          {/* Undo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length <= 1}
            className="rounded-lg bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-40 transition-colors"
            title="Undo"
          >
            Undo
          </button>

          {/* Redo */}
          <button
            type="button"
            onClick={handleRedo}
            disabled={redoList.length === 0}
            className="rounded-lg bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-40 transition-colors"
            title="Redo"
          >
            Redo
          </button>

          <div className="h-4 w-px bg-slate-700" />

          {/* Clear board */}
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg bg-rose-900/60 px-2 py-1 text-xs font-semibold text-rose-200 hover:bg-rose-800 hover:text-white transition-colors"
            title="Clear all board drawings"
          >
            Clear
          </button>

          {/* Save / Export Notes */}
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-lg bg-teal-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-teal-500 transition-colors shadow"
            title="Save board notes as image"
          >
            Save Notes
          </button>
        </div>

        {/* Canvas container */}
        <div
          ref={containerRef}
          className="relative h-full w-full cursor-crosshair overflow-hidden"
          style={{
            backgroundColor: getBoardBg(),
          }}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="block h-full w-full"
          />

          {/* Floating text input box when text tool clicked */}
          {textInput.visible && (
            <div
              className="absolute z-40 flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur"
              style={{ left: `${textInput.x}px`, top: `${textInput.y}px` }}
            >
              <input
                type="text"
                autoFocus
                value={textInput.value}
                onChange={(e) =>
                  setTextInput((prev) => ({ ...prev, value: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCommitText();
                  if (e.key === "Escape")
                    setTextInput({ visible: false, x: 0, y: 0, value: "" });
                }}
                placeholder="Type equation or note..."
                className="rounded bg-slate-800 px-2 py-1 text-xs text-white outline-none focus:ring-1 focus:ring-teal-400"
              />
              <button
                type="button"
                onClick={handleCommitText}
                className="rounded bg-teal-600 px-2 py-1 text-xs font-semibold text-white hover:bg-teal-500"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() =>
                  setTextInput({ visible: false, x: 0, y: 0, value: "" })
                }
                className="rounded bg-slate-800 px-1.5 py-1 text-xs text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
