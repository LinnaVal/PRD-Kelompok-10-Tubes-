
"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toko } from '@/data/menuTb3.json'; 

export default function TenantDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const tenant = Number(id);
  const data = toko.find((current) => current.tenantID === tenant);

  type CartItem = { id: number | undefined, name: string | undefined, price: number, quantity: number };
  type Order = { cart: CartItem[], totalPrice: string, status: string };
  type ListOrders = {tenant: number, id: number, order: Order };

  const [selectedPage, setSelectedPage] = useState(0);
  const [listOrders, setListOrders] = useState<ListOrders[]>([]); 

  useEffect(() => {
    if (typeof window !== "undefined") {
      setListOrders(JSON.parse(localStorage.getItem("orders") || "[]"));
      const interval = setInterval(() => {
        setListOrders(JSON.parse(localStorage.getItem("orders") || "[]"));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const itemsPerPage = 5; // Disesuaikan agar pas di layar
  const totalItems = listOrders.length;
  const displayItems = listOrders.slice(selectedPage, selectedPage + itemsPerPage);
  const currentPageNum = Math.floor(selectedPage / itemsPerPage) + 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  const handlePrev = () => setSelectedPage((p) => Math.max(0, p - itemsPerPage));
  const handleNext = () => setSelectedPage((p) => p + itemsPerPage);

  if (!data) return null;

  return (
    <div className="bg-[#F4F3ED] font-sans text-zinc-950 overflow-hidden relative" style={{ width: 360, height: 640 }}>
      {/* HEADER */}
      <header className="border-b border-zinc-300 px-3 pt-2.5 pb-2 flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={() => router.push("/")} className="text-sm px-2 py-1 border border-zinc-400 bg-white hover:bg-zinc-100 cursor-pointer">
            ←
          </button>
          
            <button 
                onClick={() => router.push(`/login/tenant/${id}/edit`)}
                className="text-[10px] px-2 py-1.5 bg-orange-500 text-white font-bold rounded shadow hover:bg-orange-600 transition cursor-pointer active:scale-95"
            >
                Kelola Menu
            </button>
        </div>
        <div className="text-right">
          <h1 className="text-sm font-extrabold text-[#1B4D3E] uppercase">{data.name}</h1>
          <p className="text-[10px] font-bold text-zinc-600">Dashboard Penjual</p>
        </div>
      </header>
      
      {/* DAFTAR PESANAN */}
      <div className="p-4 overflow-y-auto" style={{ height: 500 }}>
        <h2 className="text-xs font-extrabold text-zinc-800 mb-3 border-b-2 border-[#1B4D3E] inline-block pb-1">PESANAN MASUK</h2>
        
        {listOrders.length === 0 ? (
          <p className="text-center text-xs text-zinc-400 mt-8">Belum ada pesanan yang masuk.</p>
        ) : (
          displayItems.filter((order) => order.tenant === tenant).map((order, index) => (
            <div 
              key={order.id} 
              onClick={() => router.push(`/login/tenant/${id}/detail/${order.id}`)}
              className="block w-full bg-white border border-zinc-300 p-3 mb-3 shadow-sm hover:border-[#1B4D3E] transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-extrabold text-sm text-[#1B4D3E]">ORD-{index+1}</h3>
                {order.order.status === 'done' ? (
                  <span className="text-[9px] bg-green-100 text-[#1B4D3E] px-1.5 py-0.5 font-bold border border-green-300">SELESAI</span>
                ) : (
                  <span className="text-[9px] bg-red-100 text-[#A61C3C] px-1.5 py-0.5 font-bold border border-red-300">BARU</span>
                )}
              </div>
              <p className="text-[10px] text-zinc-500">{order.order.cart.length} Item • Rp{order.order.totalPrice}</p>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {listOrders.length > itemsPerPage && (
        <div className="flex items-center justify-between px-3 border-t border-zinc-200 bg-[#F4F3ED] absolute bottom-0 w-full" style={{ height: 40 }}>
          <button onClick={handlePrev} disabled={selectedPage === 0} className={`px-3 py-1 border border-[#1B4D3E] bg-white font-bold text-[#1B4D3E] text-[10px] ${selectedPage === 0 ? "opacity-30" : "cursor-pointer"}`}>← Prev</button>
          <span className="text-[10px] font-bold text-[#1B4D3E]">{currentPageNum} / {totalPages}</span>
          <button onClick={handleNext} disabled={selectedPage + itemsPerPage >= totalItems} className={`px-3 py-1 border border-[#1B4D3E] bg-white font-bold text-[#1B4D3E] text-[10px] ${selectedPage + itemsPerPage >= totalItems ? "opacity-30" : "cursor-pointer"}`}>Next →</button>
        </div>
      )}
    </div>
  );
}