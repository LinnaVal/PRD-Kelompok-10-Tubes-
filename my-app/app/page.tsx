"use client";
import { toko } from '@/data/menuTb3.json';
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BuyerHomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = toko.filter((tenant) =>
    tenant.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="bg-[#F4F3ED] font-sans text-zinc-950 overflow-hidden relative"
      style={{ width: 360, height: 640 }}
    >
      {/* HEADER */}
      <header className="border-b border-zinc-300 px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 mb-1.5">

          {/* PROFILE */}
          <div onClick={() => router.push("/login")}
          className="w-8 h-8 bg-zinc-200 border border-zinc-400 flex items-center justify-center shrink-0 cursor-pointer hover:bg-zinc-300">
            <span className="text-sm">👤</span>
          </div>

          {/* SEARCH BAR */}
          <input
            type="text"
            placeholder="Cari Tenant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white py-1 px-2 outline-none border border-[#1B4D3E] text-xs"
          />
        </div>

        <h1 className="text-sm font-extrabold tracking-tight text-[#1B4D3E]">
          DAFTAR TENANT
        </h1>
      </header>

      {/* MAIN CONTENT */}
      <div className="px-3 pt-3 overflow-y-auto" style={{ height: 572 }}>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((tenant) => (
            <div
              key={tenant.tenantID}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => router.push(`/menu/${tenant.tenantID}`)}
            >
              {/* Tenant Card */}
              <div
                className="w-full bg-[#FACB1A] border border-zinc-400 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shadow-sm"
                style={{ aspectRatio: "1 / 1" }}
              >
                <span className="text-4xl">
                  {"🏪"}
                </span>
              </div>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-zinc-800 text-center leading-tight">
                {tenant.name}
              </p>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-xs text-zinc-400 mt-8">
            Tidak ada tenant yang ditemukan.
          </p>
        )}
      </div>
    </div>
  );
}
