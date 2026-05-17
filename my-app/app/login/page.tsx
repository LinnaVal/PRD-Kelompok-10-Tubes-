"use client";
import { toko } from '@/data/menuTb3.json';
import { useRouter } from "next/navigation";
import { useState } from 'react';

export default function LoginPage () {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [pressed, setPressed] = useState(false);
    const found = toko.find((tenant) => tenant.username === username && tenant.password === password);

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
                    <h1 className="text-lg font-bold text-[#1B4D3E] text-center ml-28.5">LOGIN</h1>
                </div>
            </header>
            {/* Login Form */}
            <div className="flex flex-col items-center justify-center h-10/12 px-6 ">
                <h1 className='text-xl mb-5 text-[#1B4D3E] font-semibold'>Masukkan Data Anda</h1>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => {setUsername(e.target.value), setPressed(false)}}
                    className="border border-zinc-400 bg-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] py-2 px-4 mb-4"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value), setPressed(false)}}
                    className="border border-zinc-400 bg-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] py-2 px-4 mb-4"
                />
                <button
                    onClick={() => {
                        setPressed(true);
                        if (found) {
                            setPressed(false);
                            {router.push(`/login/tenant/${found.tenantID}`)}
                        }
                    }}
                    className="w-62.5 text-sm px-4 py-2 border border-[#1B4D3E] bg-[#1B4D3E] text-white hover:bg-[#16392B] leading-none cursor-pointer "
                >
                    Login
                </button>
                {!found && username && password && pressed &&
                 <div className="text-red-500 mt-4">Username atau password salah</div>}
                {!username && !password && pressed &&
                 <div className="text-red-500 mt-4">Masukkan username dan password</div>}
            </div>
            
        </div>
    )
}