import { TextObject } from "@/types/editor";

export function getTextFont(text: TextObject) {
    const fontFamily = text.fontFamily ?? "Arial";
    const quotedFontFamily = fontFamily.includes(" ") ? `"${fontFamily}"` : fontFamily;

    return `${text.fontStyle ?? "normal"} ${text.fontWeight ?? "normal"} ${text.fontSize}px ${quotedFontFamily}`;
}