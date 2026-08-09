"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Eye, EyeOff, Trash2, Plus, Loader2, Link2 } from "lucide-react";
import { addGalleryImage, updateGalleryImage, deleteGalleryImage } from "@/actions/gallery";
import ImageUploader from "@/components/admin/ImageUploader";

interface GalleryImage {
  id: string;
  url: string;
  caption: string | null;
  link: string | null;
  isVisible: boolean;
}

interface Props {
  initialImages: GalleryImage[];
}

export default function GalleryManager({ initialImages }: Props) {
  const [images, setImages] = useState(initialImages);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [newUrls, setNewUrls] = useState<string[]>([]);
  const [addCaption, setAddCaption] = useState("");
  const [addLink, setAddLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editLink, setEditLink] = useState("");

  function act(fn: () => Promise<any>) {
    setError(null);
    startTransition(async () => {
      const result = await fn();
      if (result?.error) setError(result.error);
    });
  }

  async function handleAddImages() {
    if (newUrls.length === 0) return;
    setUploading(true);
    for (const url of newUrls) {
      const result = await addGalleryImage(url, addCaption || undefined, addLink || undefined);
      if (result?.error) { setError(result.error); setUploading(false); return; }
    }
    setUploading(false);
    setNewUrls([]);
    setAddCaption("");
    setAddLink("");
    // Refresh by reloading
    window.location.reload();
  }

  function startEdit(img: GalleryImage) {
    setEditingId(img.id);
    setEditCaption(img.caption ?? "");
    setEditLink(img.link ?? "");
  }

  function saveEdit(id: string) {
    act(async () => {
      const result = await updateGalleryImage(id, { caption: editCaption, link: editLink });
      if (!result?.error) {
        setImages((prev) => prev.map((img) => img.id === id ? { ...img, caption: editCaption || null, link: editLink || null } : img));
        setEditingId(null);
      }
      return result;
    });
  }

  return (
    <div className="space-y-8">
      {/* Upload new images */}
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Upload New Images</h2>
        <ImageUploader images={newUrls} onChange={setNewUrls} maxImages={10} />
        {newUrls.length > 0 && (
          <div className="mt-4 space-y-3">
            <input
              type="text" value={addCaption} onChange={(e) => setAddCaption(e.target.value)}
              placeholder="Caption (optional)"
              className="block w-full rounded-md border-gray-300 border p-2 text-sm"
            />
            <input
              type="url" value={addLink} onChange={(e) => setAddLink(e.target.value)}
              placeholder="Link URL (optional, e.g. https://instagram.com/p/...)"
              className="block w-full rounded-md border-gray-300 border p-2 text-sm"
            />
            <button
              onClick={handleAddImages} disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add {newUrls.length} image{newUrls.length > 1 ? "s" : ""} to Gallery
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200 text-sm text-red-700">{error}</div>
      )}

      {/* Gallery grid */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Gallery ({images.length} images)
        </h2>
        {images.length === 0 ? (
          <p className="text-sm text-gray-500">No gallery images yet. Upload some above.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className={`relative group rounded-xl overflow-hidden border-2 ${img.isVisible ? "border-green-300" : "border-gray-200"} bg-gray-100`}>
                <div className="aspect-square relative">
                  <Image src={img.url} alt={img.caption || ""} fill className="object-cover" sizes="300px" />
                </div>

                {/* Overlay controls */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => act(() => updateGalleryImage(img.id, { isVisible: !img.isVisible }).then(r => { if (!r?.error) setImages(prev => prev.map(i => i.id === img.id ? { ...i, isVisible: !i.isVisible } : i)); return r; }))}
                      className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white transition-colors" title={img.isVisible ? "Hide" : "Show"}
                    >
                      {img.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => act(() => deleteGalleryImage(img.id).then(r => { if (!r?.error) setImages(prev => prev.filter(i => i.id !== img.id)); return r; }))}
                      className="p-1.5 bg-red-500/60 hover:bg-red-600/80 rounded-lg text-white transition-colors" title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => startEdit(img)}
                    className="text-xs text-white/80 hover:text-white text-center underline"
                  >
                    Edit caption / link
                  </button>
                </div>

                {/* Caption */}
                {img.caption && (
                  <div className="p-2 bg-white border-t">
                    <p className="text-xs text-gray-600 truncate">{img.caption}</p>
                  </div>
                )}

                {/* Hidden badge */}
                {!img.isVisible && (
                  <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-[10px] px-1.5 py-0.5 rounded">Hidden</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Edit Image Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                <input type="text" value={editCaption} onChange={(e) => setEditCaption(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md p-2 text-sm" placeholder="e.g. Summer collection 2024" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                <input type="url" value={editLink} onChange={(e) => setEditLink(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md p-2 text-sm" placeholder="https://..." />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setEditingId(null)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => saveEdit(editingId)} disabled={isPending}
                className="px-3 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
