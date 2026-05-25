"use client";

import { useState } from "react";
import Image from "next/image";

interface MenuAdmin {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  deskripsi: string;
  gambar: string;
}

export default function Admin() {
  const [tenantName, setTenantName] = useState("Tenant 1");
  const [isEditTenant, setIsEditTenant] = useState(false);
  const [inputTenantName, setInputTenantName] = useState("Tenant 1");

  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editNama, setEditNama] = useState("");
  const [editHarga, setEditHarga] = useState(0);
  const [editStok, setEditStok] = useState(0);
  const [editDeskripsi, setEditDeskripsi] = useState("");
  const [editGambar, setEditGambar] = useState("/images (5).jfif");

  const [menus, setMenus] = useState<MenuAdmin[]>([
    { id: 1, nama: "Menu 1", harga: 15000, stok: 10, gambar: "/images (5).jfif", deskripsi: "Deskripsi lezat mengenai hidangan spesial." },
    { id: 2, nama: "Menu 2", harga: 18000, stok: 15, gambar: "/images (5).jfif", deskripsi: "Deskripsi lezat mengenai hidangan spesial." },
    { id: 3, nama: "Menu 3", harga: 20000, stok: 8,  gambar: "/images (5).jfif", deskripsi: "Deskripsi lezat mengenai hidangan spesial." },
    { id: 4, nama: "Menu 4", harga: 12000, stok: 20, gambar: "/images (5).jfif", deskripsi: "Deskripsi lezat mengenai hidangan spesial." },
    { id: 5, nama: "Menu 5", harga: 25000, stok: 5,  gambar: "/images (5).jfif", deskripsi: "Deskripsi lezat mengenai hidangan spesial." },
    { id: 6, nama: "Menu 6", harga: 14000, stok: 12, gambar: "/images (5).jfif", deskripsi: "Deskripsi lezat mengenai hidangan spesial." },
    { id: 7, nama: "Menu 7", harga: 16000, stok: 14, gambar: "/images (5).jfif", deskripsi: "Deskripsi lezat mengenai hidangan spesial." },
    { id: 8, nama: "Menu 8", harga: 22000, stok: 7,  gambar: "/images (5).jfif", deskripsi: "Deskripsi lezat mengenai hidangan spesial." },
    { id: 9, nama: "Menu 9", harga: 17000, stok: 11, gambar: "/images (5).jfif", deskripsi: "Deskripsi lezat mengenai hidangan spesial." },
  ]);

  const bukaEdit = (menu: MenuAdmin) => {
    setSelectedId(menu.id);
    setEditNama(menu.nama);
    setEditHarga(menu.harga);
    setEditStok(menu.stok);
    setEditDeskripsi(menu.deskripsi);
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
          ? { ...m, nama: editNama, harga: editHarga, stok: editStok, deskripsi: editDeskripsi, gambar: editGambar }
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
      <main className="relative flex h-full max-h-screen w-[412px] flex-col items-center justify-start bg-lime-300 p-6 shadow-2xl overflow-hidden">
        
        <div className="mt-12 mb-10 w-full px-4 text-center flex flex-col items-center justify-center">
          {isEditTenant ? (
            <div className="flex items-center gap-2 w-full max-w-[240px]">
              <input 
                type="text"
                value={inputTenantName}
                onChange={(e) => setInputTenantName(e.target.value)}
                className="w-full h-9 border border-orange-500 rounded-xl px-3 text-sm font-bold text-orange-500 bg-white focus:outline-none focus:border-orange-600 text-center uppercase"
                autoFocus
              />
              <button 
                onClick={simpanNamaTenant}
                className="h-9 px-3 bg-orange-500 text-white text-xs font-black rounded-xl uppercase transition active:scale-95 shadow hover:bg-orange-600"
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
              className="text-xl font-black tracking-widest uppercase text-orange-500 cursor-pointer hover:opacity-80 transition flex items-center gap-1 select-none"
            >
              {tenantName} ✏️
            </h1>
          )}
        </div>

        <div className="grid grid-cols-3 gap-x-4 gap-y-6 w-full max-w-[280px] px-2">
          {menus.map((menu) => (
            <div key={menu.id} className="flex flex-col items-center gap-2">
              <div 
                onClick={() => bukaEdit(menu)}
                className="aspect-square w-full rounded-2xl bg-white/20 border-2 border-dashed border-orange-500/40 flex flex-col items-center justify-center overflow-hidden hover:bg-white/30 transition duration-200 cursor-pointer relative"
              >
                <Image src={menu.gambar} alt={menu.nama} fill className="object-cover" />
              </div>
              <span className="text-xs font-bold text-orange-500 tracking-wide">{menu.nama}</span>
            </div>
          ))}
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
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
                  <Image src={editGambar} alt="Preview" fill className="object-cover" />
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
