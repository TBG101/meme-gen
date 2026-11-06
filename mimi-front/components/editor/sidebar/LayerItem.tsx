import {
  ArrowDown,
  ArrowUp,
  Bold,
  Italic,
  SlidersHorizontal,
  Trash,
} from "lucide-react";
import { TextObject } from "@/types/editor";
import { useState, useEffect } from "react";

type LayerItemProps = {
  layer: TextObject;
  index: number;
  totalLayers: number;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onHover: (hovered: boolean) => void;
  onUpdateStyle: (style: Partial<TextObject>) => void;
};

export default function LayerItem({
  layer,
  index,
  totalLayers,
  isExpanded,
  onToggleExpanded,
  onDelete,
  onMoveUp,
  onMoveDown,
  onHover,
  onUpdateStyle,
}: LayerItemProps) {
  const [fontSize, setFontSize] = useState(String(layer.fontSize));

  useEffect(() => {
    setFontSize(String(layer.fontSize));
  }, [layer.fontSize]);

  const commitFontSize = (input: any) => {
    const raw = input.target.value;
    if (raw.trim() === "") return;

    const value = Number(raw);
    if (!Number.isFinite(value)) return;
    setFontSize(raw);

    if (value >= 8 && value <= 200) {
      onUpdateStyle({ fontSize: value });
    }
  };

  return (
    <li
      className="group rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-surface-hover"
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
    >
      <div className="flex items-center gap-2.5">
        <span className="min-w-0 flex-1 truncate">{layer.text}</span>
        <button
          type="button"
          aria-expanded={isExpanded}
          title="Edit layer style"
          className="flex h-7 w-7 items-center justify-center rounded bg-surface text-muted transition-colors hover:text-primary cursor-pointer"
          onClick={onToggleExpanded}
        >
          <SlidersHorizontal size={14} />
        </button>
        <button
          type="button"
          title="Move layer up"
          disabled={index === totalLayers - 1}
          className="flex h-7 w-7 items-center justify-center rounded bg-surface text-muted transition-colors hover:text-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          onClick={onMoveUp}
        >
          <ArrowUp size={14} />
        </button>
        <button
          type="button"
          title="Move layer down"
          disabled={index === 0}
          className="flex h-7 w-7 items-center justify-center rounded bg-surface text-muted transition-colors hover:text-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          onClick={onMoveDown}
        >
          <ArrowDown size={14} />
        </button>
        <button
          type="button"
          title="Delete layer"
          className="flex h-7 w-7 items-center justify-center rounded bg-surface text-muted transition-colors hover:text-danger cursor-pointer"
          onClick={onDelete}
        >
          <Trash size={14} />
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-2 border-t border-border pt-3">
          <label
            className="text-xs text-muted"
            htmlFor={`font-family-${index}`}
          >
            Font
          </label>
          <select
            id={`font-family-${index}`}
            value={layer.fontFamily ?? "Arial"}
            className="input w-36 py-1 text-xs"
            onChange={(event) =>
              onUpdateStyle({ fontFamily: event.target.value })
            }
          >
            {["Arial", "Georgia", "Impact", "Courier New", "Verdana"].map(
              (font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ),
            )}
          </select>

          <label className="text-xs text-muted" htmlFor={`font-size-${index}`}>
            Size
          </label>
          <div className="flex items-center gap-2">
            <input
              id={`font-size-${index}`}
              type="number"
              min={8}
              max={200}
              value={fontSize}
              onChange={commitFontSize}
              onBlur={commitFontSize}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              className="input w-16 py-1 text-xs text-center tabular-nums"
            />
            <span className="text-xs text-muted">px</span>
          </div>

          <label className="text-xs text-muted" htmlFor={`font-color-${index}`}>
            Color
          </label>
          <input
            id={`font-color-${index}`}
            type="color"
            value={layer.color}
            className="h-8 w-12 cursor-pointer border-0 bg-transparent"
            onChange={(event) => onUpdateStyle({ color: event.target.value })}
          />

          <span className="text-xs text-muted">Style</span>
          <div className="flex justify-end gap-1">
            <button
              type="button"
              aria-label="Toggle bold"
              aria-pressed={layer.fontWeight === "bold"}
              className={`flex h-8 w-8 items-center justify-center rounded border border-border cursor-pointer ${layer.fontWeight === "bold" ? "bg-primary text-primary-foreground" : "bg-surface text-muted"}`}
              onClick={() =>
                onUpdateStyle({
                  fontWeight: layer.fontWeight === "bold" ? "normal" : "bold",
                })
              }
            >
              <Bold size={14} />
            </button>
            <button
              type="button"
              aria-label="Toggle italic"
              aria-pressed={layer.fontStyle === "italic"}
              className={`flex h-8 w-8 items-center justify-center rounded border border-border cursor-pointer ${layer.fontStyle === "italic" ? "bg-primary text-primary-foreground" : "bg-surface text-muted"}`}
              onClick={() =>
                onUpdateStyle({
                  fontStyle: layer.fontStyle === "italic" ? "normal" : "italic",
                })
              }
            >
              <Italic size={14} />
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
