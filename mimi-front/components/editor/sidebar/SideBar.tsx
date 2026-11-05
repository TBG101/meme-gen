import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TextObject } from "@/types/editor";
import AddTextPanel from "./AddTextPanel";
import ImageActionsPanel from "./ImageActionsPanel";
import LayersPanel from "./LayersPanel";

export type SideBarProps = {
  addNewText: (text: string, fontSize: number, color: string) => void;
  texts: TextObject[];
  deleteText: (textIndex: number) => void;
  moveLayerUp: (textIndex: number) => void;
  moveLayerDown: (textIndex: number) => void;
  setHoveredText: (textIndex: number | null) => void;
  importImage: (file: File) => void;
  saveImage: () => void;
  sharePublicly: () => Promise<string>;
  updateTextStyle: (textIndex: number, style: Partial<TextObject>) => void;
};

export default function SideBar({
  addNewText,
  texts,
  deleteText,
  moveLayerUp,
  moveLayerDown,
  setHoveredText,
  importImage,
  saveImage,
  sharePublicly,
  updateTextStyle,
}: SideBarProps) {
  return (
    <aside className="w-72 shrink-0 h-screen flex flex-col bg-surface border-l border-border">


      <AddTextPanel addNewText={addNewText} />

      <LayersPanel
        texts={texts}
        deleteText={deleteText}
        moveLayerUp={moveLayerUp}
        moveLayerDown={moveLayerDown}
        setHoveredText={setHoveredText}
        updateTextStyle={updateTextStyle}
      />

      <ImageActionsPanel
        importImage={importImage}
        saveImage={saveImage}
        sharePublicly={sharePublicly}
      />
    </aside>
  );
}
