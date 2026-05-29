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
  

  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editNama, setEditNama] = useState("");
  const [editHarga, setEditHarga] = useState(0);
  const [editStok, setEditStok] = useState(0);
  const [editDeskripsi, setEditDeskripsi] = useState("");
  const [editGambar, setEditGambar] = useState("");
  const [menus, setMenus] = useState<MenuAdmin[]>([]);

  const data = toko.find((current) => current.tenantID === tenant);
  if (!data) return null;
  const item = data.menu.find((m) => m.id === selectedMenu);
  const [menu, setMenu] = useState(data.menu);

  const handleToggleStock = async () => {
    await fetch("/api/menu", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantID: tenant, menuID: selectedMenu }),
    });

    setMenu((prev) =>
      prev.map((m) =>
        m.id === selectedMenu ? { ...m, stock: m.stock === "stok ada" ? "stok habis" : "stok ada" } : m
      )
    );
  }
  // const [tenantName, setTenantName] = useState("Tenant");
  // const [isEditTenant, setIsEditTenant] = useState(false);
  // const [inputTenantName, setInputTenantName] = useState("");

  const [selectedPage, setSelectedPage] = useState(0);
  const itemsPerPage = 9;

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //   const data = toko.find((current) => current.tenantID === tenant);
  //     const storedName = localStorage.getItem(`tenant_name_${tenant}`);
  //     if (storedName) {
  //       setTenantName(storedName);
  //       setInputTenantName(storedName);
  //     } else {
  //       const data = toko.find((current) => current.tenantID === tenant);
  //       if (data) {
  //         setTenantName(data.name);
  //         setInputTenantName(data.name);
  //       }
  //     }

  //     const localMenus = localStorage.getItem(`menus_tenant_${tenant}`);
  //     if (localMenus) {
  //       setMenus(JSON.parse(localMenus));
  //     } else {
  //       const data = toko.find((current) => current.tenantID === tenant);
  //       if (data) {
  //         const initialMenus = data.menu.map((item) => ({
  //           id: item.id,
  //           name: item.name,
  //           price: item.price,
  //           stok: 10,
  //           description: "Deskripsi lezat hidangan spesial siap disajikan.",
  //           type: item.type,
  //           gambar: item.type === "food" ? "🍛" : "🥤"
  //         }));
  //         setMenus(initialMenus);
  //         localStorage.setItem(`menus_tenant_${tenant}`, JSON.stringify(initialMenus));
  //       }
  //     }
  //   }
  // }, [tenant]);

  const displayItems = data.menu.slice(selectedPage, selectedPage + itemsPerPage);
  const totalItems = data.menu.length;
  const currentPageNum = Math.floor(selectedPage / itemsPerPage) + 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const handlePrev = () => setSelectedPage((p) => Math.max(0, p - itemsPerPage));
  const handleNext = () => setSelectedPage((p) => p + itemsPerPage);


  const bukaTambah = () => {
    setSelectedId(null);
    setEditNama("");
    setEditHarga(0);
    setEditStok(10);
    setEditDeskripsi("Deskripsi lezat hidangan spesial siap disajikan.");
    setEditGambar("🍛");
    setIsOpen(true);
  };

  const simpanPerubahan = () => {
    let updatedMenus: MenuAdmin[] = [];
    if (selectedId !== null) {
      updatedMenus = menus.map((m) =>
        m.id === selectedId
          ? { ...m, name: editNama, price: editHarga, stok: editStok, description: editDeskripsi, gambar: editGambar }
          : m
      );
    } else {
      const newId = menus.length > 0 ? Math.max(...menus.map((m) => m.id)) + 1 : 1;
      const newItem: MenuAdmin = {
        id: newId,
        name: editNama || "Menu Baru",
        price: editHarga,
        stok: editStok,
        description: editDeskripsi,
        type: editGambar === "🥤" ? "drink" : "food",
        gambar: editGambar
      };
      updatedMenus = [...menus, newItem];
    }
    setMenus(updatedMenus);
    localStorage.setItem(`menus_tenant_${tenant}`, JSON.stringify(updatedMenus));
    setIsOpen(false);
  };


  if (!data) return <div className="p-4 text-center text-red-500 font-sans">Data tenant tidak ditemukan.</div>;

  return (
    <div className="bg-[#F4F3ED] font-sans text-zinc-950 overflow-hidden relative flex flex-col justify-between" style={{ width: 360, height: 640 }}>
      <div 
        className="bg-[#F4F3ED] font-sans text-zinc-950 overflow-hidden relative" 
        style={{ width: 360, height: 640 }}
      >
        <header className="border-b border-zinc-300 px-3 pt-2.5 pb-2 bg-white relative flex items-center justify-between min-h-[46px]">
          <button 
            onClick={() => router.push(`/login/tenant/${id}`)} 
            className="text-sm px-2 py-1 border border-zinc-400 bg-white hover:bg-zinc-100 leading-none cursor-pointer"
        >
            ←
          </button>
          <h1 className="text-sm font-black tracking-widest text-[#1B4D3E] text-center flex-1 pr-1 truncate uppercase">{data.name}</h1>
        </header>

        {/* <div className="px-3 pt-2 flex justify-end">
          <button 
            onClick={bukaTambah}
            className="text-[9px] px-2.5 py-1 bg-orange-500 text-white font-black uppercase rounded shadow hover:bg-orange-600 transition cursor-pointer active:scale-95"
          >
            + Tambah Menu
          </button>
        </div> */}
        
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

        {selectedMenu && item && (
          <div onClick={() => setSelectedMenu(null)} className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[280px] bg-white border-4 border-orange-500 rounded-3xl p-4 shadow-2xl flex flex-col gap-2 max-h-[85vh] overflow-y-auto">
              <h2 className="text-xs font-black text-orange-500 text-center uppercase">
                Edit Menu
              </h2>
              <div className="flex flex-col items-center gap-1 w-full">
                <div className="w-full bg-zinc-50 border flex items-center justify-center text-3xl h-16 relative rounded-xl overflow-hidden">{editGambar.startsWith("blob:") ? <Image src={editGambar} alt="Preview" fill className="object-cover" unoptimized /> : <span>{item.type === "food" ? "🍛" : "🥤"}</span>}</div>
              </div>
              <p className="w-full h-8 border rounded-xl px-2.5 py-2 text-xs text-orange-500 font-bold"> {item.name} </p>
              <p className="w-full h-8 border rounded-xl px-2.5 py-2 text-xs text-orange-500 font-bold"> Rp{item.price.toLocaleString("id-ID")} </p>
              <div className="flex items-center gap-3 justify-center">
                <button onClick={() => handleToggleStock()} className="w-full h-8 rounded bg-orange-500 capitalize text-white font-bold cursor-pointer">
                  {item.stock == "stok ada" ? "stok ada" : "stok habis"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}