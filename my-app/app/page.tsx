"use client";
import { toko } from '@/data/menuTb3.json';
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BuyerHomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedPage, setSelectedPage] = useState(0);

  type CartItem = {
    id: number | undefined,
    name: string | undefined,
    price: number | undefined,
    quantity: number
  }
  let updatedCart : CartItem[] = [];
  type Order = {
      cart : CartItem[],
      totalPrice : string,
      status : string
    }
    type ListOrders = {
        id : number,
        order : Order
    }

  let removeList : ListOrders[] = [];
  // localStorage.setItem("orders", JSON.stringify(removeList));
  const filtered = toko.filter((tenant) =>
    tenant.name.toLowerCase().includes(search.toLowerCase())
  );
  const itemsPerPage = 4;
  const displayItems = search
    ? filtered.slice(0, itemsPerPage)
    : filtered.slice(selectedPage, selectedPage + itemsPerPage);

  const totalItems = filtered.length;
  const currentPageNum = Math.floor(selectedPage / itemsPerPage) + 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const handlePrev = () => setSelectedPage((p) => Math.max(0, p - itemsPerPage));
  const handleNext = () => setSelectedPage((p) => p + itemsPerPage);

  return (
    <div
      className="bg-[#F4F3ED] font-sans text-zinc-950 relative"
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
      <div className="px-3 pt-3 overflow-y-auto" style={{ height: 520 }}>
        <div className="grid grid-cols-2 gap-3">
          {displayItems.map((tenant) => (
            <div
              key={tenant.tenantID}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => {router.push(`/menu/${tenant.tenantID}`)
                updatedCart = [];
                localStorage.setItem("cart", JSON.stringify(updatedCart));
            }}
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
      {/* PAGINATION */}
      {(!search ) && (
        <div
          className="flex items-center justify-between px-3 border-t border-zinc-200 bg-[#F4F3ED]"
          style={{ height: 36 }}
        >
          <button
            onClick={handlePrev}
            disabled={selectedPage === 0}
            className={`px-3 py-1 border border-[#1B4D3E] bg-white font-bold text-[#1B4D3E] text-xs transition-all 
              ${selectedPage === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-[#1B4D3E] hover:text-white cursor-pointer"}`}
          >
            ← Prev
          </button>
          <span className="text-xs font-bold text-[#1B4D3E]">
            {currentPageNum} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={selectedPage + itemsPerPage >= totalItems}
            className={`px-3 py-1 border border-[#1B4D3E] bg-white font-bold text-[#1B4D3E] text-xs transition-all
              ${selectedPage + itemsPerPage >= totalItems ? "opacity-30 cursor-not-allowed" : "hover:bg-[#1B4D3E] hover:text-white cursor-pointer"}`}
          >
            Next →
          </button>
        </div>
      )}

    </div>
  );
}
