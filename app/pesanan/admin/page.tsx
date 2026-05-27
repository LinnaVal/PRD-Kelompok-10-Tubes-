"use client";

import { toko } from '@/data/menuTb3.json';
import { useRouter } from "next/navigation";
import { useState, use } from "react";
import Image from "next/image";

interface MenuAdmin {
  id: number;
  name: string;
  price: number;
  stok: number;
  description: string;
  type: string;
  gambar: string;
}

export default function AdminPage({ params }: { params?: Promise<{ id?: string }> }) {
  const router = useRouter();
  
  const resolvedParams = params ? use(params) : {};
  const tenantIdFromUrl = resolvedParams.id ? Number(resolvedParams.id) : 1;
  const tenant = isNaN(tenantIdFromUrl) ? 1 : tenantIdFromUrl;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editNama, setEditNama] = useState("");
  const [editHarga, setEditHarga] = useState(0);
  const [editStok, setEditStok] = useState(0);
  const [editDeskripsi, setEditDeskripsi] = useState("");
  const [editGambar, setEditGambar] = useState("");

  const [tenantName, setTenantName] = useState(() => {
    const data = toko.find((current) => current.tenantID === tenant);
    return data ? data.name : "Tenant 1";
  });
  const [isEditTenant, setIsEditTenant] = useState(false);
  const [inputTenantName, setInputTenantName] = useState(tenantName);

  const [selectedPage, setSelectedPage] = useState(0);
  const itemsPerPage = 9;

  const [menus, setMenus] = useState<MenuAdmin[]>(() => {
    const data = toko.find((current) => current.tenantID === tenant);
    if (!data) return [];
    return data.menu.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      stok: 10,
      description: "Deskripsi lezat mengenai hidangan spesial.",
      type: item.type,
      gambar: item.type === "food" ? "🍛" : "🥤"
    }));
  });

  const displayItems = menus.slice(selectedPage, selectedPage + itemsPerPage);
  const totalItems = menus.length;
  const currentPageNum = Math.floor(selectedPage / itemsPerPage) + 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrev = () => setSelectedPage((p) => Math.max(0, p - itemsPerPage));
  const handleNext = () => setSelectedPage((p) => p + itemsPerPage);

  const bukaEdit = (menu: MenuAdmin) => {
    setSelectedId(menu.id);
    setEditNama(menu.name);
    setEditHarga(menu.price);
    setEditStok(menu.stok);
    setEditDeskripsi(menu.description);
    setEditGambar(menu.gambar);
    setIsOpen(true);
  };
  const gantiFotoHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const urlGambar = URL.createObjectURL(file);
      setEditGambar(urlGambar);
    }
  };

  const simpanPerubahan = () => {
    setMenus((prev) =>
      prev.map((m) =>
        m.id === selectedId
          ? { ...m, name: editNama, price: editHarga, stok: editStok, description: editDeskripsi, gambar: editGambar }
          : m
      )
    );
    setIsOpen(false);
  };

  const simpanNamaTenant = () => {
    if (inputTenantName.trim() !== "") {
      setTenantName(inputTenantName);
    }
    setIsEditTenant(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-100 font-sans dark:bg-zinc-900">
      <main className="relative flex h-full max-h-screen w-[412px] flex-col items-center justify-start bg-[#F4F3ED] p-6 shadow-2xl overflow-hidden text-zinc-950">
        
        <div className="mt-12 mb-10 w-full px-4 text-center flex flex-col items-center justify-center">
          {isEditTenant ? (
            <div className="flex items-center gap-2 w-full max-w-[240px]">
              <input 
                type="text"
                value={inputTenantName}
                onChange={(e) => setInputTenantName(e.target.value)}
                className="w-full h-9 border border-[#1B4D3E] bg-white rounded-xl px-3 text-sm font-bold text-[#1B4D3E] focus:outline-none text-center uppercase"
                autoFocus
              />
              <button 
                onClick={simpanNamaTenant}
                className="h-9 px-3 bg-[#1B4D3E] text-white text-xs font-black rounded-xl uppercase transition active:scale-95 shadow hover:bg-[#153b2f]"
              >
                OK
              </button>
            </div>
          ) : (
            <h1 
              onClick={() => {
                setInputTenantName(tenantName);
                setIsEditTenant(true);
              }}
              className="text-xl font-black tracking-widest uppercase text-[#1B4D3E] cursor-pointer hover:opacity-80 transition flex items-center gap-1 select-none"
            >
              {tenantName} ✏️
            </h1>
          )}
        </div>

        <div className="grid grid-cols-3 gap-x-4 gap-y-6 w-full max-w-[280px] px-2 flex-1 content-start">
          {displayItems.map((menu) => {
            const isFood = menu.type === "food";
            const bgItemColor = isFood ? "bg-[#D2EE9D]" : "bg-[#FACB1A]";

            return (
              <div key={menu.id} className="flex flex-col items-center gap-1">
                <div 
                  onClick={() => bukaEdit(menu)}
                  className={`aspect-square w-full ${bgItemColor} border border-zinc-300 flex items-center justify-center overflow-hidden shadow-sm hover:scale-105 transition-transform cursor-pointer relative rounded-2xl`}
                >
                  {menu.gambar.startsWith("blob:") ? (
                    <Image src={menu.gambar} alt={menu.name} fill className="object-cover" unoptimized />
                  ) : (
                    <span className="text-2xl">{menu.gambar}</span>
                  )}
                </div>
                <div className="text-center w-full px-0.5 flex flex-col">
                  <span className="text-[8px] font-bold text-zinc-900 uppercase tracking-tight leading-tight truncate">{menu.name}</span>
                  <span className="text-[8px] font-extrabold text-zinc-600">Rp{menu.price.toLocaleString("id-ID")}</span>
                  <span className="text-[8px] font-bold text-[#1B4D3E]">Stok: {menu.stok}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="flex items-center justify-between w-full max-w-[280px] px-3 border-t border-zinc-200 bg-[#F4F3ED] mb-6"
          style={{ height: 36 }}
        >
          <button
            onClick={handlePrev}
            disabled={selectedPage === 0}
            className={`px-3 py-1 border border-[#1B4D3E] bg-white font-bold text-[#1B4D3E] text-xs transition-all 
              ${selectedPage === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-[#1B4D3E] hover:text-white cursor-pointer active:scale-95"}`}
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
              ${selectedPage + itemsPerPage >= totalItems ? "opacity-30 cursor-not-allowed" : "hover:bg-[#1B4D3E] hover:text-white cursor-pointer active:scale-95"}`}
          >
            Next →
          </button>
        </div>

        {isOpen && (
          <div 
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 duration-200 opacity-100 pointer-events-auto"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[360px] bg-white border-4 border-orange-500 rounded-3xl p-5 shadow-2xl relative flex flex-col gap-3 duration-200 scale-100 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-sm font-black tracking-wide text-orange-500 uppercase text-center mb-1">
                Edit Menu
              </h2>

              <div className="flex flex-col items-center gap-2 w-full">
                <div className="w-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-5xl h-24 relative rounded-xl overflow-hidden shadow-inner">
                  {editGambar.startsWith("blob:") ? (
                    <Image src={editGambar} alt="Preview" fill className="object-cover" unoptimized />
                  ) : (
                    <span>{editGambar}</span>
                  )}
                </div>
                <label className="cursor-pointer bg-zinc-100 border border-zinc-200 text-zinc-600 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide hover:bg-zinc-200 transition active:scale-95">
                  Pilih Foto Baru
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={gantiFotoHandler} 
                    className="hidden" 
                  />
                </label>
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Nama Menu</label>
                <input 
                  type="text" 
                  value={editNama} 
                  onChange={(e) => setEditNama(e.target.value)}
                  className="w-full h-9 border border-zinc-200 bg-zinc-50 rounded-xl px-3 text-xs font-bold text-orange-500 focus:outline-none focus:bg-zinc-100 focus:border-orange-500"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Harga Menu (Rp)</label>
                <input 
                  type="number" 
                  value={editHarga} 
                  onChange={(e) => setEditHarga(Number(e.target.value))}
                  className="w-full h-9 border border-zinc-200 bg-zinc-50 rounded-xl px-3 text-xs font-bold text-orange-500 focus:outline-none focus:bg-zinc-100 focus:border-orange-500"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Jumlah Stok</label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => editStok > 0 && setEditStok(editStok - 1)}
                    className="w-7 h-7 rounded-lg bg-orange-500 text-white font-black flex items-center justify-center active:scale-95 transition text-sm hover:bg-orange-600"
                  >
                    -
                  </button>
                  <span className="text-sm font-black text-amber-500 w-6 text-center">
                    {editStok}
                  </span>
                  <button 
                    onClick={() => setEditStok(editStok + 1)}
                    className="w-7 h-7 rounded-lg bg-orange-500 text-white font-black flex items-center justify-center active:scale-95 transition text-sm hover:bg-orange-600"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Deskripsi</label>
                <textarea 
                  value={editDeskripsi} 
                  onChange={(e) => setEditDeskripsi(e.target.value)}
                  className="w-full h-12 border border-zinc-200 bg-zinc-50 rounded-xl p-2 text-xs font-medium text-zinc-800 resize-none focus:outline-none focus:bg-zinc-100 focus:border-orange-500"
                />
              </div>

              <button 
                onClick={simpanPerubahan}
                className="w-full h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black tracking-widest text-xs transition active:scale-[0.98] uppercase mt-1"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
