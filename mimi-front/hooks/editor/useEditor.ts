import { useEffect, useRef, useState } from "react";
import { TextObject } from "@/types/editor";
import { getMousePosition, isMouseInText } from "@/lib/editor/geometry";
import { drawCanvas } from "@/lib/editor/drawing";
import { imagesService } from "@/services/images-service";

const DOUBLE_TAP_TIME = 300;

export function useEditor() {
    const currentImage = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const texts = useRef<TextObject[]>([]);

    const selected = useRef<number | null>(null);
    const hovered = useRef<number | null>(null);

    const offset = useRef({ x: 0, y: 0 });

    const [editing, setEditing] = useState<{
        index: number; value: string;
        left: number; top: number; fontSize: number;
        color: string;
        fontFamily: string;
        fontWeight: "normal" | "bold";
        fontStyle: "normal" | "italic";
    } | null>(null);


    const lastTap = useRef({ time: 0, index: -1 });

    const [version, setVersion] = useState(0);
    const bump = () => setVersion(v => v + 1);

    const getCtx = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        return canvas && ctx ? { canvas, ctx } : null;
    };

    const redraw = () => {
        const c = getCtx();
        if (c) drawCanvas(c.canvas, c.ctx, currentImage.current, texts.current, selected.current, hovered.current);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    }

    const importImage = (file: File) => {
        if (!file.type.startsWith("image/")) return;
        const imageUrl = URL.createObjectURL(file);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageUrl;

        img.onload = () => {
            currentImage.current = img;
            const c = getCtx();
            if (c) {
                c.canvas.width = img.naturalWidth;
                c.canvas.height = img.naturalHeight;
                redraw();
            }
            URL.revokeObjectURL(imageUrl);
        }

        img.onerror = (err) => {
            console.error("Failed to load the image into the canvas", err);
            URL.revokeObjectURL(imageUrl);
        };
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) importImage(file);
    };

    const isDoubleTap = (textIndex: number, now: number) => {
        return (lastTap.current.index === textIndex && now - lastTap.current.time < DOUBLE_TAP_TIME)
    }

    const startEditing = (i: number) => {
        const c = getCtx();
        if (!c) return;

        const t = texts.current[i];
        const rect = c.canvas.getBoundingClientRect();

        const scaleX = rect.width / c.canvas.width;
        const scaleY = rect.height / c.canvas.height;

        t.isEditingText = true;

        setEditing({
            index: i,
            value: t.text,
            left: rect.left + window.scrollX + t.x * scaleX,
            top: rect.top + window.scrollY + (t.y - t.fontSize) * scaleY,
            fontSize: t.fontSize * scaleY,
            color: t.color,
            fontFamily: t.fontFamily ?? "Arial",
            fontWeight: t.fontWeight ?? "normal",
            fontStyle: t.fontStyle ?? "normal",
        });

        redraw();
    };

    const changeEditing = (value: string) => {
        if (!editing) return;
        texts.current[editing.index].text = value;
        setEditing({ ...editing, value });
    };

    const commitEditing = () => {
        if (!editing) return;
        const t = texts.current[editing.index];
        t.isEditingText = false;
        if (!t.text.trim()) texts.current.splice(editing.index, 1); // empty = delete
        setEditing(null);
        bump();
        redraw()
    };

    const onPointerDown = (e: React.PointerEvent) => {
        const c = getCtx();
        if (!c) return;

        const mouse = getMousePosition(e, c.canvas);
        if (!mouse) return;

        const now = performance.now();


        // Last element is the last to be drawn, so we check last first
        for (let i = texts.current.length - 1; i >= 0; i--) {
            const currentText = texts.current[i];
            if (isMouseInText(mouse!.x, mouse!.y, currentText, c.ctx!)) {
                if (isDoubleTap(i, now)) {
                    lastTap.current = { time: 0, index: -1 };
                    selected.current = null;
                    startEditing(i);
                    return
                } else {
                    lastTap.current = { time: now, index: i };
                    selected.current = i;
                    const x = mouse.x - currentText.x
                    const y = mouse.y - currentText.y
                    offset.current = { x, y }
                    return;
                }
            }
        }
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (editing) return;

        const c = getCtx();
        if (!c) return;

        const mouse = getMousePosition(e, c.canvas);
        if (!mouse) return;

        if (selected.current !== null) {
            const selectedText = texts.current[selected.current];
            selectedText.x = mouse.x - offset.current.x;
            selectedText.y = mouse.y - offset.current.y;
        }

        hovered.current = null;

        // Last element is the last to be drawn, so we check last first
        for (let i = texts.current.length - 1; i >= 0; i--) {
            const currentText = texts.current[i];

            if (isMouseInText(mouse.x, mouse.y, currentText, c.ctx)) {
                hovered.current = i;
                break;
            }
        }


        redraw();

    }

    const onPointerUp = () => {
        selected.current = null;
        bump();
    }

    const addNewText = (text: string, fontSize: number, color: string) => {
        const c = getCtx();
        if (!c) return;
        const x = c.canvas.width / 2;
        const y = c.canvas.height / 2;

        texts.current.push(
            {
                text,
                x,
                y,
                fontSize,
                color,
                fontFamily: "Arial",
                fontWeight: "normal",
                fontStyle: "normal",
            },
        )
        bump();
        redraw()
    }

    const deleteText = (textIndex: number) => {
        texts.current.splice(textIndex, 1);
        selected.current = null;
        lastTap.current = { time: 0, index: -1 };
        bump();
        redraw();
    };

    const moveLayer = (textIndex: number, direction: -1 | 1) => {
        const nextIndex = textIndex + direction;
        if (textIndex < 0 || nextIndex < 0 || nextIndex >= texts.current.length) return;

        [texts.current[textIndex], texts.current[nextIndex]] = [
            texts.current[nextIndex],
            texts.current[textIndex],
        ];

        const updateIndex = (index: number) => {
            if (index === textIndex) return nextIndex;
            if (index === nextIndex) return textIndex;
            return index;
        };

        if (selected.current !== null) selected.current = updateIndex(selected.current);
        if (hovered.current !== null) hovered.current = updateIndex(hovered.current);
        if (lastTap.current.index !== -1) {
            lastTap.current.index = updateIndex(lastTap.current.index);
        }
        setEditing(current =>
            current ? { ...current, index: updateIndex(current.index) } : null
        );

        bump();
        redraw();
    };

    const moveLayerUp = (textIndex: number) => moveLayer(textIndex, 1);
    const moveLayerDown = (textIndex: number) => moveLayer(textIndex, -1);

    const setHoveredText = (index: number | null) => {
        hovered.current = index;
        redraw();
    };

    const saveImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (!blob) return;

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "image.png";
            link.click();

            URL.revokeObjectURL(url);
        }, "image/png");
    };

    const sharePublicly = async () => {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Could not export canvas image");

        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/png"),
        );

        if (!blob) throw new Error("Could not export canvas image");

        const formData = new FormData();
        formData.append("image", blob, "image.png");

        const image = await imagesService.createImage(formData);
        return image.url;
    };

    const updateTextStyle = (
        textIndex: number,
        style: Partial<Pick<TextObject, "fontSize" | "color" | "fontFamily" | "fontWeight" | "fontStyle">>
    ) => {
        const text = texts.current[textIndex];
        if (!text) return;

        Object.assign(text, style);

        if (editing?.index === textIndex) {
            const c = getCtx();
            const rect = c?.canvas.getBoundingClientRect();
            const scaleY = c && rect ? rect.height / c.canvas.height : 1;
            setEditing(current => current ? {
                ...current,
                top: rect
                    ? rect.top + window.scrollY + (text.y - text.fontSize) * scaleY
                    : current.top,
                fontSize: text.fontSize * scaleY,
                color: text.color,
                fontFamily: text.fontFamily ?? "Arial",
                fontWeight: text.fontWeight ?? "normal",
                fontStyle: text.fontStyle ?? "normal",
            } : null);
        }

        bump();
        redraw();
    }

    // draw at first page load
    useEffect(() => {
        redraw();
    }, []);

    return {
        canvasRef,
        texts,
        handleDrop,
        importImage,
        handleDragOver,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        addNewText, editing, changeEditing, commitEditing, deleteText, moveLayerUp, moveLayerDown,
        setHoveredText, saveImage, sharePublicly, updateTextStyle
    };
}
