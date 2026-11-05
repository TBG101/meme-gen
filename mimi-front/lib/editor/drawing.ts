import { TextObject } from "@/types/editor";
import { getTextFont } from "@/lib/editor/text-style";

export function drawCanvas(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement | null,
    texts: TextObject[],
    seletecTextIndex: number | null,
    hoveredTextIndex: number | null
) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (image) {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    drawTexts(ctx, texts, seletecTextIndex, hoveredTextIndex);
}

export function drawTexts(
    ctx: CanvasRenderingContext2D,
    texts: TextObject[],
    seletecTextIndex: number | null,
    hoveredTextIndex: number | null
) {
    texts.forEach((text, i) => {
        if (text.isEditingText === true) return;

        ctx.font = getTextFont(text);
        ctx.fillStyle = text.color;
        ctx.fillText(text.text, text.x, text.y);

        if (i === seletecTextIndex || i === hoveredTextIndex) {
            drawBoundingBoxText(ctx, text);
            return;
        }

    });
}

export function drawBoundingBoxText(
    ctx: CanvasRenderingContext2D,
    text: TextObject,
) {
    const padding = 4;
    ctx.font = getTextFont({ ...text, fontSize: text.fontSize });
    ctx.textBaseline = "alphabetic";

    const metrics = ctx.measureText(text.text);
    const ascent = metrics.actualBoundingBoxAscent || text.fontSize;
    const descent = metrics.actualBoundingBoxDescent || 0;

    const boxX = text.x - padding;
    const boxY = text.y - ascent - padding;
    const boxWidth = metrics.width + padding * 2;
    const boxHeight = ascent + descent + padding * 2;

    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
}
