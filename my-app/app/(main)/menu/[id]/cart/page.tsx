"use client";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

export default function TransactionPage ({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const num = Number(id);

    const [selectedPage, setSelectedPage] = useState(0);
    
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
        tenant : number,
        id : number,
        order : Order
    }
    const empty : ListOrders[] = [];
    const [cart, setCart] = useState<CartItem[]>(() => {
        if (typeof window !== "undefined") {
            const storedCart = localStorage.getItem("cart");
            return storedCart ? JSON.parse(storedCart) : [];
        }
    });
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString("id-ID");
    const itemsPerPage = 9; 
    const totalItems = cart.length;
    const currentPageNum = Math.floor(selectedPage / itemsPerPage) + 1;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const displayItems = selectedPage === 0
    ? cart.slice(0, itemsPerPage)
    : cart.slice(selectedPage, selectedPage + itemsPerPage);
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
            onClick={() => {{router.push(`/menu/${id}`)
          }
            }}
            className="text-sm px-2 py-1 border border-zinc-400 bg-white hover:bg-zinc-100 leading-none cursor-pointer"
          >
            ←
          </button>
        </div>
        <div>
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">RANGKUMAN</p>
          <h2 className="text-sm font-extrabold tracking-tight text-[#1B4D3E] uppercase leading-tight">
            TRANSAKSI
          </h2>
        </div>
      </header>

      {/* MAIN CONTENT */}
      {cart.length === 0 ? (
        <main className="p-3">
          <p className="text-[10px] text-zinc-600">
            Belum ada item di keranjang
          </p>
        </main>
      ) : (
        <main className="p-3">
          {displayItems.map((item) => (
            <div key={item.id} className="mb-2">
              <p className="text-sm font-bold">{item.name}</p>
              <p className="text-[10px] text-zinc-600">
                Qty: {item.quantity} | Total: Rp{(item.price * item.quantity).toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </main>
      )}

      { /* PAGINATION */}
      {cart.length >= 9 && <div
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
        <div className='px-3 py-2 border-t border-zinc-300 bg-white text-[#1B4D3E]' >
            Harga Total : Rp{totalPrice}
        </div>

        { /* CONFIRMATION */ }
      {cart.length > 0   && <div className="absolute bottom-0 left-0 w-full px-3 py-2 border-t border-zinc-300 bg-white">
        <button
          onClick={() => {
            localStorage.setItem("transaction", totalPrice);
            const newOrder : Order = {
              cart,
              totalPrice,
              status: "pending"
            }
            const listOrders : ListOrders[] = JSON.parse(localStorage.getItem("orders") || "[]");
            if (listOrders.length === 0) {
              const firstOrder : ListOrders = {
                tenant : num,
                id: 1,
                order: newOrder
              }
              localStorage.setItem("orders", JSON.stringify([firstOrder]));
              localStorage.setItem("currentOrderID", firstOrder.id.toString());
            } else {
              const nextOrder : ListOrders = {
                tenant : num,
                id: listOrders.length + 1,
                order: newOrder
              }
              localStorage.setItem("orders", JSON.stringify([...listOrders, nextOrder]));
              localStorage.setItem("currentOrderID", nextOrder.id.toString());
            }
            
            router.push(`/menu/${id}/cart/transaction`);
            console.log(listOrders);
          }}
          className="w-full py-2 bg-[#1B4D3E] text-white font-bold text-sm hover:bg-[#16342B] transition-colors cursor-pointer">
          KONFIRMASI
        </button>
      </div>}
    </div>
)}