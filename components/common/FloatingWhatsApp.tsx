"use client";

import { useState } from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { X } from "lucide-react";

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);

  const phone = "447742846710";

  const defaultMessage = encodeURIComponent(
    "Hello! I would like to enquire about your products."
  );

  const quickReplies = [
    "I want Goat Meat",
    "I want Catfish",
    "Delivery Information",
    "Track My Order",
  ];

  return (
    <>
      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200 animate-in slide-in-from-bottom-4 duration-300 text-gray-700">

          {/* Header */}
          <div className="flex items-center justify-between bg-[#c9a96e] px-4 py-3 text-white">
            <div>
              <h3 className="font-semibold">Kiki African Taste</h3>
              <p className="text-xs opacity-90">
                Typically replies within a few minutes
              </p>
            </div>

            <button onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4 p-4 bg-gray-50">

            <div className="rounded-xl bg-white p-3 shadow-sm">
              👋 Hello! Welcome to <strong>Kiki African Taste</strong>.
              <br />
              How can we help you today?
            </div>

            <div className="grid gap-2">
              {quickReplies.map((reply) => (
                <Link
                  key={reply}
                  href={`https://wa.me/${phone}?text=${encodeURIComponent(
                    reply
                  )}`}
                  target="_blank"
                  className="rounded-lg border p-3 text-sm transition hover:bg-[#725a2d]hover:text-white"
                >
                  {reply}
                </Link>
              ))}
            </div>

            <Link
              href={`https://wa.me/${phone}?text=${defaultMessage}`}
              target="_blank"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#c9a96e] py-3 font-semibold text-white transition hover:brightness-110"
            >
              <FaWhatsapp className="h-5 w-5" />
              Start WhatsApp Chat
            </Link>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-400 text-white shadow-2xl transition hover:scale-110"
      >
        {open ? (
          <X className="h-7 w-7" />
        ) : (
          <FaWhatsapp className="h-8 w-8" />
        )}
      </button>
    </>
  );
}