import { TextObject } from "@/types/editor";
import { getTextFont } from "@/lib/editor/text-style";




export const isMouseInText = (
    mouseX: number,
    mouseY: number,
    text: TextObject,
    ctx: CanvasRenderingContext2D
) => {
    ctx.font = getTextFont(text);

    const width = ctx.measureText(text.text).width;
    const height = text.fontSize;

    return (
        mouseX >= text.x &&
        mouseX <= text.x + width &&
        mouseY >= text.y - height &&
        mouseY <= text.y
    );
};

export function getMousePosition(
    e: React.PointerEvent,
    canvas: HTMLCanvasElement
) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
}

