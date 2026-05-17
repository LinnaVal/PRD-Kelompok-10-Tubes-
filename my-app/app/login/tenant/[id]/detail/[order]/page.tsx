"use client";
import { use, useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import { toko } from '@/data/menuTb3.json'; 

export default function TenantPage({ params }: { params: Promise<{ id: string, order: string }> }) {
    const router = useRouter();
    const { id, order } = use(params);

    const [selectedPage, setSelectedPage] = useState(0);
    const [pressed, setPressed] = useState(false);
    const [listOrders, setListOrders] = useState<ListOrders[]>([]);

    type CartItem = {
    id: number | undefined,
    name: string | undefined,
    price: number,
    quantity: number
    }
    type Order = {
      cart : CartItem[],
      totalPrice : string,
      status : string
    }
    type ListOrders = {
        id : number,
        order : Order
    }

    const current : ListOrders[] = JSON.parse(localStorage.getItem("orders") || "[]");
    const menu : Order = current.find((current) => current.id === Number(order))?.order || {
        cart: [],
        totalPrice: "0",
        status: "pending"
    };
    useEffect(() => {
        if (typeof window !== "undefined") {
            current.map((item) => {
                if (item.id === Number(order)) {
                    item.order.status = "paid confirmation";
                    setListOrders(current);
                }
            });
            localStorage.setItem("orders", JSON.stringify(current));
            console.log(current);
        }}, []);
    const itemsPerPage = 9; 
    const totalItems = menu.cart.length;
    const currentPageNum = Math.floor(selectedPage / itemsPerPage) + 1;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const displayItems = selectedPage === 0
    ? menu.cart.slice(0, itemsPerPage)
    : menu.cart.slice(selectedPage, selectedPage + itemsPerPage);
    const handlePrev = () => setSelectedPage((p) => Math.max(0, p - itemsPerPage));
    const handleNext = () => setSelectedPage((p) => p + itemsPerPage);

    return (
        <div
        className="bg-[#F4F3ED] font-sans text-zinc-950 overflow-hidden relative"
        style={{ width: 360, height: 640 }}
        >
            <header className="border-b border-zinc-300 px-3 pt-2.5 pb-2 ">
                <div className="flex gap-2 mb-1.5">
                    <button
                    onClick={() => {
                    {router.push(`/login/tenant/${id}`)}
                    }}
                    className="text-sm px-2 py-1 border border-zinc-400 bg-white hover:bg-zinc-100 leading-none cursor-pointer "
                    >
                        ←
                    </button>
                    <h1 className="text-xl font-bold text-[#1B4D3E] text-center ml-19.5 ">Pesanan {order}</h1>
                </div>
            </header>

            { /* Detail Pesanan */}
            <div>
                <main className="p-3">
                    {displayItems.map((item) => (
                        <div key={item.id} className="mb-2">
                        <p className="text-sm font-bold">{item.name} | Qty: {item.quantity} </p>
                        <p className="text-[10px] text-zinc-600"> </p>
                        </div>
                    ))}
                </main> 
            </div>

            { /* PAGINATION */}
      {menu.cart.length >= 9 && <div
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
        </div>}
        <button 
        onClick={() => {
            setPressed(true);
            current.map((item) => {
                if (item.id === Number(order)) {
                    item.order.status = "done";
                    setListOrders(current);
                }
            });
            localStorage.setItem("orders", JSON.stringify(current));
        }}
        className={`relative ml-11.25 top-10 border border-[#1B4D3E]  text-white w-62.5  mt-5
            ${!pressed ? "bg-[#ec8219] hover:bg-[#ec8219]/90 cursor-pointer" : "bg-[#1dcd43] hover:bg[#1dcd43]/90 cursor-not-allowed"}`}>
            {!pressed ? "Sedang Dibuat" : "Pesanan Selesai"}
        </button>

    </div>


    )
}