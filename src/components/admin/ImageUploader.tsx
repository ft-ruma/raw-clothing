"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface UploadedImage {
  url: string;
  publicId?: string;
  previewUrl?: string; // local blob URL for preview
}

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 8,
}: ImageUploaderProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
    images.map((url) => ({ url }))
  );
  const [uploading, setUploading] = useState<number[]>([]); // slot indices being uploaded
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pushError = (msg: string) => {
    setErrors((prev) => [...prev, msg]);
    setTimeout(() => setErrors((prev) => prev.slice(1)), 5000);
  };

  const uploadFile = async (file: File): Promise<UploadedImage | null> => {
    if (!file.type.startsWith("image/")) {
      pushError(`"${file.name}" is not an image file.`);
      return null;
    }
    if (file.size > 10 * 1024 * 1024) {
      pushError(`"${file.name}" exceeds 10 MB limit.`);
      return null;
    }

    const previewUrl = URL.createObjectURL(file);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      pushError(data.error ?? "Upload failed.");
      URL.revokeObjectURL(previewUrl);
      return null;
    }

    return { url: data.url, publicId: data.publicId, previewUrl };
  };

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArr = Array.from(files);
      const slots = uploadedImages.length;
      const canAdd = maxImages - slots;

      if (canAdd <= 0) {
        pushError(`Maximum of ${maxImages} images allowed.`);
        return;
      }

      const toProcess = fileArr.slice(0, canAdd);
      const startIndex = slots;

      // Reserve slots with placeholders
      const placeholders: UploadedImage[] = toProcess.map(() => ({ url: "" }));
      setUploadedImages((prev) => [...prev, ...placeholders]);
      setUploading((prev) => [
        ...prev,
        ...toProcess.map((_, i) => startIndex + i),
      ]);

      const results = await Promise.all(toProcess.map(uploadFile));

      setUploadedImages((prev) => {
        const next = [...prev];
        results.forEach((result, i) => {
          if (result) {
            next[startIndex + i] = result;
          } else {
            next.splice(startIndex + i, 1);
          }
        });
        // Remove any failed empty placeholders
        const cleaned = next.filter((img, idx) => {
          if (img.url === "" && uploading.includes(idx)) return false;
          return true;
        });
        
        // Trigger onChange in a microtask/setTimeout to prevent React render-phase state update warning
        setTimeout(() => {
          onChange(cleaned.filter((img) => img.url).map((img) => img.url));
        }, 0);

        return cleaned;
      });

      setUploading((prev) =>
        prev.filter((i) => !toProcess.map((_, idx) => startIndex + idx).includes(i))
      );
    },
    [uploadedImages, maxImages, onChange, uploading]
  );

  const handleRemove = (index: number) => {
    const updated = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updated);
    onChange(updated.filter((img) => img.url).map((img) => img.url));
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const isUploading = uploading.length > 0;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {uploadedImages.length < maxImages && (
        <div
          className={`relative flex flex-col items-center justify-center w-full min-h-[160px] rounded-xl border-2 border-dashed transition-colors cursor-pointer
            ${isDragging
              ? "border-black bg-gray-100"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
            }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <div className="flex flex-col items-center gap-2 p-6 text-center pointer-events-none">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                <p className="text-sm text-gray-500">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">
                  Drag & drop images here, or click to browse
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, WEBP up to 10 MB · Max {maxImages} images
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error Messages */}
      {errors.map((err, i) => (
        <div key={i} className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700 border border-red-200">
          {err}
        </div>
      ))}

      {/* Image Thumbnails Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {uploadedImages.map((img, index) => {
            const isLoading = uploading.includes(index);
            const displaySrc = img.previewUrl || img.url;

            return (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100 group"
              >
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                  </div>
                ) : displaySrc ? (
                  <Image
                    src={displaySrc}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized={!!img.previewUrl} // blob URLs can't be optimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-300" />
                  </div>
                )}

                {/* Overlay with remove button */}
                {!isLoading && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="rounded-full bg-white p-1.5 text-gray-700 hover:text-red-600 shadow-md transition-colors"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Primary badge */}
                {index === 0 && !isLoading && displaySrc && (
                  <span className="absolute top-1.5 left-1.5 rounded-full bg-black px-2 py-0.5 text-[10px] font-medium text-white">
                    Primary
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
