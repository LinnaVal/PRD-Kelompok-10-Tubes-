"use client";

import { toko } from '@/data/menuTb3.json';
import { useRouter } from "next/navigation";
import { useState, use, useEffect } from "react";
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

export default function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const tenant = Number(id);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editNama, setEditNama] = useState("");
  const [editHarga, setEditHarga] = useState(0);
  const [editStok, setEditStok] = useState(0);
  const [editDeskripsi, setEditDeskripsi] = useState("");
  const [editGambar, setEditGambar] = useState("");
  const [menus, setMenus] = useState<MenuAdmin[]>([]);

  const [tenantName, setTenantName] = useState("Tenant");
  const [isEditTenant, setIsEditTenant] = useState(false);
  const [inputTenantName, setInputTenantName] = useState("");

  const [selectedPage, setSelectedPage] = useState(0);
  const itemsPerPage = 9;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem(`tenant_name_${tenant}`);
      if (storedName) {
        setTenantName(storedName);
        setInputTenantName(storedName);
      } else {
        const data = toko.find((current) => current.tenantID === tenant);
        if (data) {
          setTenantName(data.name);
          setInputTenantName(data.name);
        }
      }

      const localMenus = localStorage.getItem(`menus_tenant_${tenant}`);
      if (localMenus) {
        setMenus(JSON.parse(localMenus));
      }
    }
  }, [tenant]);

  const displayItems = menus.slice(selectedPage, selectedPage + itemsPerPage);
  const totalItems = menus.length;
  const currentPageNum = Math.floor(selectedPage / itemsPerPage) + 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

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
      setEditGambar(URL.createObjectURL(file));
    }
  };

  const simpanPerubahan = () => {
    const updatedMenus = menus.map((m) =>
      m.id === selectedId
        ? { ...m, name: editNama, price: editHarga, stok: editStok, description: editDeskripsi, gambar: editGambar }
        : m
    );
    setMenus(updatedMenus);
    localStorage.setItem(`menus_tenant_${tenant}`, JSON.stringify(updatedMenus));
    setIsOpen(false);
  };

  const simpanNamaTenant = () => {
    if (inputTenantName.trim() !== "") {
      setTenantName(inputTenantName);
      localStorage.setItem(`tenant_name_${tenant}`, inputTenantName);
    }
    setIsEditTenant(false);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-100 font-sans dark:bg-zinc-900 pt-10">
      <div 
        className="bg-[#F4F3ED] font-sans text-zinc-950 overflow-hidden relative" 
        style={{ width: 360, height: 640 }}
      >
        <header className="border-b border-zinc-300 px-3 pt-2.5 pb-2 bg-white relative flex items-center justify-between min-h-[46px]">
          <button 
            onClick={() => router.push("/login")} 
            className="text-sm px-2 py-1 border border-zinc-400 bg-white hover:bg-zinc-100 leading-none cursor-pointer z-10"
          >
            Login
          </button>
          
          <div className="absolute inset-x-0 text-center flex justify-center items-center px-24 pointer-events-none">
            {isEditTenant ? (
              <div className="flex items-center gap-1 pointer-events-auto">
                <input 
                  type="text" 
                  value={inputTenantName} 
                  onChange={(e) => setInputTenantName(e.target.value)} 
                  className="w-20 h-6 border border-[#1B4D3E] text-[10px] font-bold text-center uppercase bg-white" 
                  autoFocus 
                />
                <button onClick={simpanNamaTenant} className="h-6 px-1.5 bg-[#1B4D3E] text-white text-[9px] font-black cursor-pointer rounded">OK</button>
              </div>
            ) : (
              <h1 
                onClick={() => setIsEditTenant(true)} 
                className="text-xs font-black tracking-wider uppercase text-[#1B4D3E] cursor-pointer pointer-events-auto hover:opacity-80 truncate max-w-full"
              >
                {tenantName} ✏️
              </h1>
            )}
          </div>

          <button 
            onClick={() => router.push(`/login/tenant/${tenant}`)} 
            className="text-[10px] px-2 py-1 bg-[#1B4D3E] text-white font-bold hover:bg-[#153b2f] cursor-pointer z-10 shadow-sm"
          >
            Pesanan Masuk
          </button>
        </header>
        
        <div className="px-3 pt-3 overflow-hidden mx-auto" style={{ height: 410 }}>
          <div className="grid grid-cols-3 gap-x-2 gap-y-2 w-full max-w-[260px] mx-auto">
            {displayItems.map((menu) => (
              <div 
                key={menu.id} 
                onClick={() => bukaEdit(menu)}
                className="flex flex-col items-center cursor-pointer"
              >
                <div 
                  className={`w-full ${menu.type === "food" ? "bg-[#D2EE9D]" : "bg-[#FACB1A]"} border border-zinc-300 flex items-center justify-center overflow-hidden relative shadow-sm hover:scale-105 transition-transform`}
                  style={{ aspectRatio: "1 / 1" }}
                >
                  {menu.gambar.startsWith("blob:") ? (
                    <Image src={menu.gambar} alt={menu.name} fill className="object-cover" unoptimized />
                  ) : (
                    <span className="text-2xl">{menu.gambar}</span>
                  )}
                </div>
                <div className="mt-0.5 text-center w-full px-0.5">
                  <p className="text-[7.5px] font-bold text-zinc-900 uppercase tracking-tight leading-tight truncate">{menu.name}</p>
                  <p className="text-[7.5px] font-extrabold text-zinc-600 leading-none">Rp{menu.price.toLocaleString("id-ID")}</p>
                  <p className="text-[7.5px] font-bold text-[#1B4D3E] leading-none">Stok: {menu.stok}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div 
          className="absolute bottom-14 left-0 right-0 flex items-center justify-between px-3 border-t border-zinc-200 bg-[#F4F3ED] z-20"
          style={{ height: 36 }}
        >
          <button 
            onClick={handlePrev} 
            disabled={selectedPage === 0} 
            className={`px-3 py-1 border border-[#1B4D3E] bg-white font-bold text-[#1B4D3E] text-xs transition-all ${selectedPage === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-[#1B4D3E] hover:text-white cursor-pointer"}`}
          >
            ← Prev
          </button>
          <span className="text-xs font-bold text-[#1B4D3E]">{currentPageNum} / {totalPages}</span>
          <button 
            onClick={handleNext} 
            disabled={selectedPage + itemsPerPage >= totalItems} 
            className={`px-3 py-1 border border-[#1B4D3E] bg-white font-bold text-[#1B4D3E] text-xs transition-all ${selectedPage + itemsPerPage >= totalItems ? "opacity-30 cursor-not-allowed" : "hover:bg-[#1B4D3E] hover:text-white cursor-pointer"}`}
          >
            Next →
          </button>
        </div>

        {isOpen && (
          <div onClick={() => setIsOpen(false)} className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[280px] bg-white border-4 border-orange-500 rounded-3xl p-4 shadow-2xl flex flex-col gap-2 max-h-[85vh] overflow-y-auto">
              <h2 className="text-xs font-black text-orange-500 text-center uppercase">Edit Menu</h2>
              <div className="flex flex-col items-center gap-1 w-full">
                <div className="w-full bg-zinc-50 border flex items-center justify-center text-3xl h-16 relative rounded-xl overflow-hidden">{editGambar.startsWith("blob:") ? <Image src={editGambar} alt="Preview" fill className="object-cover" unoptimized /> : <span>{editGambar}</span>}</div>
                <label className="cursor-pointer bg-zinc-100 border text-[9px] font-bold px-2 py-1 rounded-md uppercase">Pilih Foto Baru<input type="file" accept="image/*" onChange={gantiFotoHandler} className="hidden" /></label>
              </div>
              <input type="text" value={editNama} onChange={(e) => setEditNama(e.target.value)} className="w-full h-8 border rounded-xl px-2.5 text-xs text-orange-500 font-bold" placeholder="Nama Menu" />
              <input type="number" value={editHarga} onChange={(e) => setEditHarga(Number(e.target.value))} className="w-full h-8 border rounded-xl px-2.5 text-xs text-orange-500 font-bold" placeholder="Harga Menu" />
              <div className="flex items-center gap-3 justify-center"><button onClick={() => editStok > 0 && setEditStok(editStok - 1)} className="w-6 h-6 rounded bg-orange-500 text-white font-bold">-</button><span className="text-xs font-black text-amber-500">{editStok}</span><button onClick={() => setEditStok(editStok + 1)} className="w-6 h-6 rounded bg-orange-500 text-white font-bold">+</button></div>
              <textarea value={editDeskripsi} onChange={(e) => setEditDeskripsi(e.target.value)} className="w-full h-10 border rounded-xl p-2 text-[10px] resize-none" placeholder="Deskripsi" />
              <button onClick={simpanPerubahan} className="w-full h-8 rounded-xl bg-orange-500 text-white font-black text-[10px] uppercase cursor-pointer tracking-wider">Simpan Perubahan</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
