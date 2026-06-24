"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    router.push(`/search?search=${encodeURIComponent(trimmed)}`);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-[#c9a96e]"
      >
        <X size={28}/>
      </button>

      <div className="flex flex-col items-center pt-24 px-4">
        <p className="text-white/50 text-xs uppercase tracking-widest mb-6">
          Search Products
        </p>

        <form onSubmit={handleSearch} className="w-full max-w-2xl">
          <div className="flex items-center bg-white rounded-full px-6 py-4 gap-3 shadow-2xl">
            <Search size={22} className="text-gray-400" />

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search goat meat, catfish..."
              className="flex-1 text-black text-lg outline-none bg-transparent"
            />

            {query && (
              <button type="button" onClick={() => setQuery("")}>
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={!query.trim()}
              className="bg-[#c9a96e] text-black font-bold px-10 py-3 rounded-full uppercase disabled:opacity-40"
            >
              Search
            </button>
          </div>
        </form>

        <p className="text-white/30 text-xs mt-6">
          Press Enter to search · Esc to close
        </p>
      </div>
    </div>
  );
}