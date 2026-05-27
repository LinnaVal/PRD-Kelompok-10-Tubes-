"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toko } from '@/data/menuTb3.json'; 

export default function TenantPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const dashboard = id;

    type CartItem = { id: number | undefined; name: string | undefined; price: number; quantity: number; }
    type Order = { cart: CartItem[]; totalPrice: string; status: string; }
    type ListOrders = { id: number; order: Order; }

    const [currentPage, setCurrentPage] = useState(1);
    const tenant = Number(id);
    const data = toko.find((current) => current.tenantID === tenant);
    const [listOrders, setListOrders] = useState<ListOrders[]>([]); 

    useEffect(() => {
        if (typeof window !== "undefined" && data) {
            const localMenus = localStorage.getItem(`menus_tenant_${tenant}`);
            if (!localMenus) {
                const initialMenus = data.menu.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    stok: 10,
                    description: "Deskripsi lezat hidangan spesial siap disajikan.",
                    type: item.type,
                    gambar: item.type === "food" ? "🍛" : "🥤"
                }));
                localStorage.setItem(`menus_tenant_${tenant}`, JSON.stringify(initialMenus));
            }
        }

        if (typeof window !== "undefined") {
            setListOrders(JSON.parse(localStorage.getItem("orders") || "[]"));
        }
        const interval = setInterval(() => {
            if (typeof window !== "undefined") {
                setListOrders(JSON.parse(localStorage.getItem("orders") || "[]"));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [data, tenant]);

    const itemsPerPage = 9; 
    const totalItems = listOrders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const displayItems = listOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (!data) return <div className="p-4 text-center text-red-500 font-sans">Data tenant tidak ditemukan.</div>;

    return (
        <div className="bg-[#F4F3ED] font-sans text-zinc-950 overflow-hidden relative flex flex-col justify-between" style={{ width: 360, height: 640 }}>
            <div>
                <header className="border-b border-zinc-300 px-3 pt-2.5 pb-2 bg-white flex items-center justify-between">
                    <button 
                        onClick={() => router.push("/login")} 
                        className="text-[10px] px-2.5 py-1.5 border border-zinc-400 bg-white font-bold hover:bg-zinc-100 cursor-pointer transition active:scale-95"
                    >
                        Login
                    </button>

                    <h1 className="text-sm font-black tracking-widest text-[#1B4D3E] text-center flex-1 pr-1 truncate uppercase">{data.name}</h1>
                    
                    <button 
                        onClick={() => router.push(`/login/tenant/${dashboard}/edit`)}
                        className="text-[10px] px-2 py-1.5 bg-orange-500 text-white font-bold rounded shadow hover:bg-orange-600 transition cursor-pointer active:scale-95"
                    >
                        Kelola Menu
                    </button>
                </header>
                
                <div className="flex flex-col items-center mt-6 px-6 overflow-y-auto max-h-[460px]">
                    <h1 className='text-lg text-[#1B4D3E] font-semibold mb-4'>Daftar Pesanan</h1>
                    {listOrders.length === 0 ? (
                        <p className="border border-[#1B4D3E] bg-[#1B4D3E]/10 text-[#1B4D3E] w-full py-2 text-center text-xs font-medium rounded">Belum ada pesanan</p>
                    ) : (
                        <div className="w-full flex flex-col gap-2.5">
                            {displayItems.map((order) => (
                                <div key={order.id} onClick={() => router.push(`/login/tenant/${dashboard}/detail/${order.id}`)} className="w-full">
                                    <button className="w-full border border-[#1B4D3E] bg-[#1B4D3E] text-white py-2 text-sm font-medium rounded hover:bg-[#153b2f] cursor-pointer text-center">
                                        Pesanan #{order.id}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {totalItems > itemsPerPage && (
                <div className="flex items-center justify-between px-4 border-t border-zinc-300 bg-white" style={{ height: 48 }}>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className={`px-3 py-1 border text-xs font-bold rounded ${currentPage === 1 ? "opacity-30" : "cursor-pointer"}`}>← Prev</button>
                    <span className="text-xs font-bold text-[#1B4D3E]">{currentPage} / {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={`px-3 py-1 border text-xs font-bold rounded ${currentPage === totalPages ? "opacity-30" : "cursor-pointer"}`}>Next →</button>
                </div>
            )}
        </div>
    );
}
