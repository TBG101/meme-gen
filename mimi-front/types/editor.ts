export type TextObject = {
    x: number,
    y: number,
    text: string,
    fontSize: number,
    color: string,
    fontFamily?: string,
    fontWeight?: "normal" | "bold",
    fontStyle?: "normal" | "italic",
    isEditingText?: boolean // hide when editing
}