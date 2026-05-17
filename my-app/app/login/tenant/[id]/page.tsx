"use client";
import { use, useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import { toko } from '@/data/menuTb3.json'; 

export default function TenantPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const dashboard = id;
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

    const [selectedPage, setSelectedPage] = useState(0);
    const tenant = Number(id);
    const data = toko.find((current) => current.tenantID === tenant);
    const [listOrders, setListOrders] = useState<ListOrders[]>([]); 
    useEffect(() => {
        if (typeof window !== "undefined") {
            const listOrders : ListOrders[] = JSON.parse(localStorage.getItem("orders") || "[]");
            setListOrders(listOrders);
        }
        const interval = setInterval(() => {
            const now : ListOrders[] = JSON.parse(localStorage.getItem("orders") || "[]");
            setListOrders(now);
            }, 1000)

        return () => clearInterval(interval)
    }, []);
    const itemsPerPage = 9; 
    const totalItems = listOrders.length;
     const displayItems = selectedPage === 0
    ? listOrders.slice(0, itemsPerPage)
    : listOrders.slice(selectedPage, selectedPage + itemsPerPage);
    const currentPageNum = Math.floor(selectedPage / itemsPerPage) + 1;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const handlePrev = () => setSelectedPage((p) => Math.max(0, p - itemsPerPage));
    const handleNext = () => setSelectedPage((p) => p + itemsPerPage);


    if (!data) return null;

    return (
        <div
        className="bg-[#F4F3ED] font-sans text-zinc-950 overflow-hidden relative"
        style={{ width: 360, height: 640 }}
        >
            <header className="border-b border-zinc-300 px-3 pt-2.5 pb-2 ">
                <div className="flex gap-2 mb-1.5">
                    <button
                    onClick={() => {
                    {router.push("/")}
                    }}
                    className="text-sm px-2 py-1 border border-zinc-400 bg-white hover:bg-zinc-100 leading-none cursor-pointer "
                    >
                        ←
                    </button>
                    <h1 className="text-xl font-bold text-[#1B4D3E] text-center ml-25.5 ">{data.name}</h1>
                </div>
            </header>
            
            { /* List of Orders */}
            <div className="flex flex-col items-center justify-center mt-7 px-6 ">
                <h1 className='top-16 text-xl  text-[#1B4D3E] font-semibold'>Daftar Pesanan</h1>
                {listOrders.length === 0 ? (
                    <p className="border border-[#1B4D3E] bg-[#1B4D3E] text-white w-50 text-center text-xs">Belum ada pesanan</p>
                ) : (
                    displayItems.map((order) => (
                        <div key={order.id} onClick={() => {
                            router.push(`/login/tenant/${dashboard}/detail/${order.id}`)
                            console.log(listOrders)
                        }}>
                            <div className="">
                                <button className="border border-[#1B4D3E] bg-[#1B4D3E] text-white w-62.5 cursor-pointer mt-5">
                                    Pesanan {order.id}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            { /* PAGINATION */}
            {listOrders.length >= 9 && <div
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
        
        </div>
    )

}