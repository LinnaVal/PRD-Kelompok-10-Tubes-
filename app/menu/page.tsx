// app/menu/page.tsx
"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { TOKO_DATA } from "../data";

export default function MenuPage() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const currentTenant = TOKO_DATA.find(t => t.tenantID === Number(idParam)) || TOKO_DATA[0];

  // PAGINATION SETUP (9 item per halaman)
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(currentTenant.menu.length / itemsPerPage);

  const currentItems = currentTenant.menu.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  return (
    <main className="min-h-screen bg-[#F4F3ED] font-sans text-zinc-950 p-4 pb-24 relative">
      
      {/* HEADER AREA */}
      <header className="mb-6 border-b border-zinc-300 pb-4">
        <div className="flex items-center gap-2 max-w-md mx-auto mb-4">
          <Link href="/" className="text-xl p-1 px-3 border border-zinc-400 bg-white rounded-none hover:bg-zinc-100">
            ←
          </Link>
          <div className="flex-1">
            <input type="text" placeholder="Cari Menu..." className="w-full bg-white rounded-none py-1.5 px-3 outline-none border border-[#1B4D3E] text-sm"/>
          </div>
        </div>
        <div className="max-w-md mx-auto">
          <h1 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">MENU</h1>
          <h2 className="text-lg font-extrabold tracking-tight text-[#1B4D3E] uppercase">{currentTenant.name}</h2>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-md mx-auto min-h-[380px]">
        <div className="grid grid-cols-3 gap-x-2 gap-y-6">
          {currentItems.map((item) => {
            const isFood = item.type === "food";
            // Makanan pakai Light Green, Minuman pakai Lemon Yellow dari palet
            const bgItemColor = isFood ? "bg-[#D2EE9D]" : "bg-[#FACB1A]";

            return (
              <div key={item.id} className="flex flex-col items-center">
                
                {/* 1. KOTAK VISUAL (Hanya berisi Emoji makanan/minuman saja sekarang) */}
                <div className={`w-full aspect-square ${bgItemColor} border border-zinc-300 rounded-none flex items-center justify-center p-1 text-center shadow-sm`}>
                  <span className="text-3xl">{isFood ? "🍛" : "🥤"}</span>
                </div>
                
                {/* CONTAINER TEKS DI BAWAH KOTAK */}
                <div className="mt-2 text-center w-full px-1">
                  
                  {/* 2. NAMA MENU (Berada di atas Harga) */}
                  <p className="text-[9px] font-bold text-zinc-900 uppercase tracking-tight leading-tight max-w-full truncate">
                    {item.name}
                  </p>
                  
                  {/* 3. HARGA MENU (MODIFIED: Sekarang posisinya tepat di bawah nama) */}
                  <p className="text-[9px] font-extrabold text-zinc-600 mt-0.5">
                    Rp{item.price.toLocaleString("id-ID")}
                  </p>
                  
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* PAGINATION CONTROLS */}
      <div className="max-w-md mx-auto mt-8 flex items-center justify-between">
        <button 
          onClick={handlePrev}
          disabled={currentPage === 0}
          className={`px-4 py-2 border border-[#1B4D3E] bg-white rounded-none font-bold text-[#1B4D3E] transition-all 
            ${currentPage === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-[#1B4D3E] hover:text-white"}`}
        >
          ← Prev
        </button>

        <span className="text-sm font-bold text-[#1B4D3E]">
          {currentPage + 1} / {totalPages}
        </span>

        <button 
          onClick={handleNext}
          disabled={currentPage === totalPages - 1}
          className={`px-4 py-2 border border-[#1B4D3E] bg-white rounded-none font-bold text-[#1B4D3E] transition-all 
            ${currentPage === totalPages - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-[#1B4D3E] hover:text-white"}`}
        >
          Next →
        </button>
      </div>

      {/* FLOATING ACTION BUTTON (KERANJANG) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-[#1B4D3E] border border-zinc-400 text-white rounded-none shadow-xl flex items-center justify-center text-2xl hover:scale-105 transition-transform">
          🛒
        </button>
      </div>

    </main>
  );
}