"use client";

import { imageResponse, imagesService } from "@/services/images-service";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useColumnCount } from "@/hooks/gallery/useColumnCount";
import { Loader2, AlertCircle, CheckCircle2, Download } from "lucide-react";

const SEARCH_LIMIT = 20;

export default function Gallery() {
  const [images, setImages] = useState<imageResponse[]>([]);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const colCount = useColumnCount();

  // first load and page change trigger
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const data = await imagesService.getAll(SEARCH_LIMIT, page);
        if (cancelled) return;
        setImages((prev) => [...prev, ...data.images]);
        if (data.images.length === 0 || page >= data.totalPages) {
          setHasMore(false);
        }
      } catch (e) {
        if (!cancelled) setHasError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [page]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && hasMore) setPage((p) => p + 1);
      },
      { rootMargin: "400px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loading, hasMore]);

  const columns = useMemo(() => {
    const cols: imageResponse[][] = Array.from({ length: colCount }, () => []);
    const heights = new Array(colCount).fill(0);

    for (const img of images) {
      if (!img.url?.trim()) continue;
      const i = heights.indexOf(Math.min(...heights));
      cols[i].push(img);
      heights[i] += img.height / img.width;
    }
    return cols;
  }, [images, colCount]);

  const handleDownload = async (url: string, id: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${id}.png`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <main className="flex flex-col">
      <div className="fixed bottom-5 right-5 z-50">
        <Link href="/editor" className="btn shadow ">
          Create Your Own
        </Link>
      </div>

      <div className="flex gap-3 p-5">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-1 flex-col gap-3">
            {col.map((image) => (
              <div key={image.id} className="group relative overflow-hidden ">
                <Image
                  src={image.url}
                  alt="Uploaded image"
                  width={image.width}
                  height={image.height}
                  loading="eager"
                  className="w-full h-auto border transition-transform duration-300 group-hover:scale-[1.02]"
                />

                <div className="absolute inset-0 flex flex-row items-end justify-between bg-linear-to-t from-black/40 via-black/5 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded bg-surface  transition-colors hover:text-primary cursor-pointer"
                      onClick={() => {
                        handleDownload(image.url, image.id);
                      }}
                    >
                      <Download size={20} />
                    </button>
                  </div>

                  <p className="text-white font-semibold text-sm">
                    Uploaded At {new Date(image.createdAt).toLocaleDateString()}
                  </p>

                  <div className="mt-1 text-xs text-white/70">
                    {image.width} × {image.height}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div ref={sentinelRef} />

      <div className="flex items-center justify-center py-6">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading more items...
          </div>
        )}

        {hasError && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            Something went wrong. Try refreshing.
          </div>
        )}

        {!loading && !hasError && !hasMore && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            You've reached the end.
          </div>
        )}
      </div>
    </main>
  );
}
