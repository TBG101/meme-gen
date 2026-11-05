import { useState } from "react";
import { TextObject } from "@/types/editor";
import LayerItem from "./LayerItem";

type LayersPanelProps = {
  texts: TextObject[];
  deleteText: (index: number) => void;
  moveLayerUp: (index: number) => void;
  moveLayerDown: (index: number) => void;
  setHoveredText: (index: number | null) => void;
  updateTextStyle: (index: number, style: Partial<TextObject>) => void;
};

export default function LayersPanel({
  texts,
  deleteText,
  moveLayerUp,
  moveLayerDown,
  setHoveredText,
  updateTextStyle,
}: LayersPanelProps) {
  const [expandedLayer, setExpandedLayer] = useState<TextObject | null>(null);

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted">
          Layers
        </h3>
        <span className="text-xs text-muted tabular-nums">{texts.length}</span>
      </div>

      <ul className="space-y-1.5">
        {texts
          .map((layer, index) => (
            <LayerItem
              key={index}
              layer={layer}
              index={index}
              totalLayers={texts.length}
              isExpanded={expandedLayer === layer}
              onToggleExpanded={() =>
                setExpandedLayer(expandedLayer === layer ? null : layer)
              }
              onDelete={() => deleteText(index)}
              onMoveUp={() => moveLayerUp(index)}
              onMoveDown={() => moveLayerDown(index)}
              onHover={(hovered) => setHoveredText(hovered ? index : null)}
              onUpdateStyle={(style) => updateTextStyle(index, style)}
            />
          ))
          .toReversed()}
      </ul>
    </div>
  );
}
