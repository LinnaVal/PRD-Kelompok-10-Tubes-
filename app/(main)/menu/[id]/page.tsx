"use client";
import { toko } from '@/data/menuTb3.json';
import { useRouter } from "next/navigation";
import { useState, use } from "react";

export default function MenuPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  type CartItem = {
    id: number | undefined,
    name: string | undefined,
    price: number | undefined,
    quantity: number
  }
  let updatedCart : CartItem[] = [];
  
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedPage, setSelectedPage] = useState(0);
  const [search, setSearch] = useState("");

  const tenant = Number(id);
  const data = toko.find((current) => current.tenantID === tenant);
  if (!data) return null;

  const serve = data.menu.find((current) => current.id === selectedMenu);
  const itemsPerPage = 9;
  const filteredMenu = data.menu.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const displayItems = search
    ? filteredMenu.slice(0, itemsPerPage)
    : data.menu.slice(selectedPage, selectedPage + itemsPerPage);

  const totalItems = data.menu.length;
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
      <header className="border-b border-zinc-300 px-3 pt-2.5 pb-2">
        <div className="flex items-center gap-2 mb-1.5">
          <button
            onClick={() => {
              {router.push("/")}
              updatedCart = [];
              localStorage.setItem("cart", JSON.stringify(updatedCart));
            }}
            className="text-sm px-2 py-1 border border-zinc-400 bg-white hover:bg-zinc-100 leading-none cursor-pointer"
          >
            ←
          </button>
          <input
            type="text"
            placeholder="Cari Menu..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedPage(0);
            }}
            className="flex-1 bg-white py-1 px-2 outline-none border border-[#1B4D3E] text-xs"
          />
        </div>
        <div>
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">MENU</p>
          <h2 className="text-sm font-extrabold tracking-tight text-[#1B4D3E] uppercase leading-tight">
            {data.name}
          </h2>
        </div>
      </header>

      {/* MENU GRID */}
      <div className="px-3 pt-2 overflow-y-auto overflow-x-hidden" style={{ height: 480 }}>
        <div className="grid grid-cols-3 gap-x-2 gap-y-3">
          {displayItems.map((item) => {
            const isFood = item.type === "food";
            const bgItemColor = isFood ? "bg-[#D2EE9D]" : "bg-[#FACB1A]";

            return (
              <div
                key={item.id}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => {
                  setSelectedMenu(item.id);
                  setQuantity(1);
                }}
              >
                <div
                  className={`w-full ${bgItemColor} border border-zinc-300 flex items-center justify-center shadow-sm hover:scale-105 transition-transform`}
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <span className="text-2xl">{isFood ? "🍛" : "🥤"}</span>
                </div>

                <div className="mt-1 text-center w-full px-0.5">
                  <p className="text-[8px] font-bold text-zinc-900 uppercase tracking-tight leading-tight truncate">
                    {item.name}
                  </p>
                  <p className="text-[8px] font-extrabold text-zinc-600">
                    Rp{item.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {displayItems.length === 0 && (
          <p className="text-center text-xs text-zinc-400 mt-6">
            Menu tidak ditemukan.
          </p>
        )}
      </div>

      {/* PAGINATION */}
      {!search && (
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

      {/* FLOATING CART */}
      <div
        onClick={() => router.push(`/menu/${tenant}/cart`)}
        className="absolute bottom-0 left-0 right-0 flex justify-end items-center px-3"
        style={{ height: 52 }}
      >
        <button className="w-10 h-10 bg-[#1B4D3E] border border-zinc-400 text-white flex items-center justify-center text-xl hover:scale-105 transition-transform shadow-lg cursor-pointer">
          🛒
        </button>
      </div>

      {/* POP-UP DETAIL MENU */}
      {selectedMenu && serve && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedMenu(null)}
        >
          <div
            className="bg-[#FACB1A] border border-zinc-400 p-4 shadow-2xl relative"
            style={{ width: 260 }}
            onClick={(e) => e.stopPropagation()}
          >

            {/* Emoji visual */}
            <div className="w-full bg-white border border-zinc-300 flex items-center justify-center text-5xl mb-3"
              style={{ height: 120 }}>
              {serve.type === "food" ? "🍛" : "🥤"}
            </div>

            <h2 className="text-xs font-extrabold uppercase tracking-tight text-zinc-900 text-center">
              {serve.name}
            </h2>
            <p className="text-[10px] font-bold text-zinc-700 text-center mt-0.5">
              Rp{serve.price.toLocaleString("id-ID")}
            </p>

            {/* Quantity */}
            <div className="flex items-center justify-center gap-4 mt-3">
              <button
                onClick={() => {
                  setQuantity((q) => Math.max(0, q - 1))
                  
                }}
                className="w-8 h-8 bg-white border border-zinc-400 text-base font-bold flex items-center justify-center hover:bg-zinc-100 transition"
              >
                −
              </button>
              <span className="text-sm font-extrabold text-zinc-900 w-5 text-center">{quantity}</span>
              <button
                onClick={
                  () => {setQuantity((q) => q + 1)
                  
                }}
                className="w-8 h-8 bg-white border border-zinc-400 text-base font-bold flex items-center justify-center hover:bg-zinc-100 transition"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            {quantity > 0 && (
              <button 
              onClick={() => {
                const cart : CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
                const exist = cart.find((item) => item.id === selectedMenu);
                if (exist) {
                  updatedCart = cart.map((item) => {
                    return item.id === selectedMenu 
                      ? { ...item, quantity: item.quantity + quantity}
                      : item
                  })
                } else {
                  const amount = quantity;
                  const newItem = {id: serve?.id, name: serve?.name, price: serve?.price, quantity: amount};
                  updatedCart = [...cart, newItem];
                }
                localStorage.setItem("cart", JSON.stringify(updatedCart));
            }}
                className="mt-3 w-full bg-[#1B4D3E] text-white text-[9px] font-extrabold uppercase tracking-widest py-2 hover:bg-[#163d31] transition cursor-pointer">
                 Tambah ke Keranjang — Rp{(serve.price * quantity).toLocaleString("id-ID")}
              </button>
            )}
            {quantity === 0 && (
              <button 
              onClick={() => {
                const cart : CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
                updatedCart = cart.filter((item) => item.id !== selectedMenu)
                localStorage.setItem("cart", JSON.stringify(updatedCart));
              }}
                className={`mt-3 w-full bg-zinc-400 text-white text-[9px] font-extrabold uppercase tracking-widest py-2 cursor-pointer hover:bg-zinc-500 transition`}>
                 Hapus dari Keranjang
              </button>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
