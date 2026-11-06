import { useEffect, useState } from "react";

export default function AddTextPanel({
  addNewText,
}: {
  addNewText: (text: string, fontSize: number, color: string) => void;
}) {
  const [newText, setNewText] = useState({
    fontSize: 14,
    color: "#000",
  });

  const commitFontSize = (input: any) => {
    const raw = input.target.value;
    if (raw.trim() === "") return;

    const value = Number(raw);
    if (!Number.isFinite(value)) return;
    setNewText({
      ...newText,
      fontSize: raw,
    });

    if (value >= 8 && value <= 200) {
      setNewText({
        ...newText,
        fontSize: raw,
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 p-5 border-b border-border">
      <button
        className="btn mt-4 w-full"
        onClick={() => addNewText("YOUR TEXT", newText.fontSize, newText.color)}
      >
        <span className="text-lg leading-none">+</span>
        Add Text
      </button>

      <div>
        <div className="flex items-end gap-3">
          <div className="flex-1 flex items-center rounded-lg border border-border bg-surface focus-within:border-primary focus-within:ring-3 focus-within:ring-ring/30">
            <input
              type="number"
              min={8}
              max={200}
              step={1}
              onChange={commitFontSize}
              onBlur={commitFontSize}
              value={newText.fontSize}
              className="w-full border-0 bg-transparent px-3 py-2 text-sm text-foreground outline-none"
            />
            <span className="pr-3 text-xs text-muted">px</span>
          </div>

          <div className="h-10 w-12">
            <input
              type="color"
              id="favcolor"
              name="favcolor"
              onChange={(event) =>
                setNewText({ ...newText, color: event.target.value })
              }
              value={newText.color}
              className="h-full w-full cursor-pointer border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
