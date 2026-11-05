"use client";
import SideBar from "@/components/editor/sidebar/SideBar";
import { useEditor } from "@/hooks/editor/useEditor";
import { useRef, useState } from "react";
import { ArrowLeft, ImagePlus } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const {
    canvasRef,
    handleDragOver,
    handleDrop,
    importImage,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    addNewText,
    editing,
    changeEditing,
    commitEditing,
    texts,
    deleteText,
    moveLayerUp,
    moveLayerDown,
    setHoveredText,
    saveImage,
    sharePublicly,
    updateTextStyle,
  } = useEditor();
  const [isDragging, setIsDragging] = useState(false);

  const dragCounter = useRef(0);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    if (dragCounter.current === 1) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDropWrapper = (e: React.DragEvent) => {
    dragCounter.current = 0;
    setIsDragging(false);
    handleDrop(e);
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      onDrop={handleDropWrapper}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <div className="fixed top-5 left-5">
        <Link href="/" className="btn shadow-2xl border">
          <span>
            <ArrowLeft />
          </span>
          Gallery
        </Link>
      </div>

      {isDragging && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-blue-500 bg-blue-500/10 pointer-events-none">
          <ImagePlus className="h-10 w-10 text-blue-500" strokeWidth={1.5} />
          <p className="text-lg font-semibold text-blue-500">
            Drop your image here
          </p>
          <p className="text-sm text-blue-500/70">
            Release to upload your image
          </p>
        </div>
      )}
      <main className="flex-1 min-w-0 min-h-0 p-4">
        <div className="flex justify-center items-center h-full w-full min-h-0 min-w-0">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full"
            style={{ touchAction: "none" }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              onPointerDown(e);
            }}
            height={500}
            width={500}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />
          {editing && (
            <input
              type="text"
              value={editing.value}
              onChange={(e) => changeEditing(e.target.value)}
              ref={(el) => {
                if (el) setTimeout(() => el.focus(), 0);
              }}
              onBlur={commitEditing}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") commitEditing();
              }}
              className="absolute m-0 p-0 leading-none text-black bg-transparent rounded-none border border-dashed border-blue-500 outline-none field-sizing-content"
              style={{
                left: editing.left,
                top: editing.top,
                fontSize: editing.fontSize,
                fontFamily: editing.fontFamily,
                fontWeight: editing.fontWeight,
                fontStyle: editing.fontStyle,
                color: editing.color,
              }}
            />
          )}
        </div>
      </main>

      <SideBar
        addNewText={addNewText}
        texts={texts.current}
        deleteText={deleteText}
        moveLayerUp={moveLayerUp}
        moveLayerDown={moveLayerDown}
        setHoveredText={setHoveredText}
        importImage={importImage}
        saveImage={saveImage}
        sharePublicly={sharePublicly}
        updateTextStyle={updateTextStyle}
      />
    </div>
  );
}
