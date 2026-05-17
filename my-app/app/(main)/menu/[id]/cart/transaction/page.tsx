"use client";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TransactionPage () {
    const router = useRouter();
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

    const [listOrders, setListOrders] = useState<ListOrders[]>([]);
    const currentOrderID = localStorage.getItem("currentOrderID");
    const current : ListOrders[] = JSON.parse(localStorage.getItem("orders") || "[]");
    const menu : Order = current.find((current) => current.id === Number(currentOrderID))?.order || {
        cart: [],
        totalPrice: "0",
        status: "pending"
    }
    useEffect(() => {
        const interval = setInterval(() => {
            const now : ListOrders[] = JSON.parse(localStorage.getItem("orders") || "[]");
            const check : Order = now.find((current) => current.id === Number(currentOrderID))?.order || {
                cart: [],totalPrice: "0",status: "pending"}
            const status = check.status;
            if (status === "paid confirmation") {
                setListOrders(now);}
            else if (status === "done") {
                setListOrders(now);}
            }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
    <div
      className="bg-[#F4F3ED] font-sans text-zinc-950 relative"
      style={{ width: 360, height: 640 }}
    >
        <Image 
        src={"/QR.png"} alt="QR CODE" width={250} height={250} className="mx-auto mt-10 mb-5"
        />
        <div className="px-3 py-2 border-t border-zinc-300 bg-white text-[#1B4D3E] text-center" >
            Total Harga : Rp{localStorage.getItem("transaction") || "0"}
        </div>
        <div className="mt-4 px-3 py-2 font-extrabold text-[#1B4D3E] text-center" >
            Status Pesanan
        </div>
        <div className={`px-3 py-2 border-t border-zinc-300 text-center text-[#F4F3ED] 
        ${menu.status === "pending" ? "bg-red-500" : ""} 
        ${menu.status === "paid confirmation" ? "bg-orange-400" : ""} 
        ${menu.status === "done" ? "bg-green-500" : ""}`
         }>
           {`${menu.status === "pending" ? "Menunggu Pembayaran" : ""}  
             ${menu.status === "paid confirmation" ? "Sedang Dibuat" : ""} 
             ${menu.status === "done" ? "Selesai" : ""}`}
        </div>
        { /* BACK TO HOME */ }
        {/* After done */}
        {menu.status === "done" && 
        <div 
        className="mt-4 px-3 py-2 absolute bottom-0 left-0 right-0 mb-5 bg-[#1B4D3E] text-white text-center cursor-pointer" 
        onClick={() => {
            router.push("/")
            setListOrders(current.filter((current) => current.id !== Number(currentOrderID)))
            localStorage.setItem("orders", JSON.stringify(current.filter((current) => current.id !== Number(currentOrderID))))
            localStorage.removeItem("cart");
            localStorage.removeItem("transaction");
            console.log(listOrders)
        }}>        
        Kembali ke Beranda
        </div>}
    </div>
    )
 }