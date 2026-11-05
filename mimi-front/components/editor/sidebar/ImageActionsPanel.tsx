import {
  Download,
  Loader2,
  Share,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { BrandXIcon, FacebookIcon } from "@/components/socialMediaIcons/icons";

type ImageActionsPanelProps = {
  importImage: (file: File) => void;
  saveImage: () => void;
  sharePublicly: () => Promise<string>;
};

export default function ImageActionsPanel({
  importImage,
  saveImage,
  sharePublicly,
}: ImageActionsPanelProps) {
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const shareImageSocial = async (platform: "facebook" | "x") => {
    const url = await sharePublicly();
    const encodedUrl = encodeURIComponent(url);

    const shareUrl =
      platform === "facebook"
        ? `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        : `https://twitter.com/intent/tweet?url=${encodedUrl}`;

    window.open(shareUrl, "_blank", "noopener,width=600,height=500");
  };

  const handleSocialShare = async (platform: "facebook" | "x") => {
    try {
      setSocialLoading(true);
      await shareImageSocial(platform);
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <div className="p-5 border-t border-border">
      <div className="flex flex-col gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) importImage(file);
            event.currentTarget.value = "";
          }}
        />
        <button
          type="button"
          className="btn w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <span>
            <Upload height={20} />
          </span>
          Import from files
        </button>
        <button className="btn w-full" onClick={saveImage}>
          <span>
            <Download height={20} />
          </span>
          Save
        </button>
        <button
          className="btn w-full"
          disabled={loading}
          onClick={async () => {
            try {
              setLoading(true);
              await sharePublicly();
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Share size={20} />
              Share Publicly
            </span>
          )}
        </button>
      </div>

      <div className="mt-4">
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          Share
        </h3>
        <div className="flex flex-row gap-2">
          <button
            type="button"
            title="Share on Facebook"
            className="flex-1 btn btn-ghost min-w-0 px-2"
            onClick={() => handleSocialShare("facebook")}
          >
            {socialLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FacebookIcon aria-hidden="true" width={16} height={16} />
            )}
          </button>
          <button
            type="button"
            title="Share on X"
            className="flex-1 btn btn-ghost min-w-0 px-2"
            onClick={() => handleSocialShare("x")}
          >
            {socialLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BrandXIcon aria-hidden="true" width={16} height={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
