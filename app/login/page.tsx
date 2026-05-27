"use client";
import { toko } from '@/data/menuTb3.json';
import { useRouter } from "next/navigation";
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pressed, setPressed] = useState(false);
  const found = toko.find((tenant) => tenant.username === username && tenant.password === password);

  return (
    <div className="bg-[#F4F3ED] font-sans text-zinc-950 overflow-hidden relative" style={{ width: 360, height: 640 }}>
      {/* HEADER */}
      <header className="border-b border-zinc-300 px-3 pt-2.5 pb-2 flex items-center">
        <button onClick={() => router.push("/")} className="text-sm px-2 py-1 border border-zinc-400 bg-white hover:bg-zinc-100 cursor-pointer">
          ←
        </button>
        <div className="flex-1 text-center pr-8">
          <h1 className="text-sm font-extrabold text-[#1B4D3E] tracking-tight">LOGIN PENJUAL</h1>
        </div>
      </header>

      {/* LOGIN FORM */}
      <div className="flex flex-col justify-center px-6" style={{ height: 500 }}>
        <div className="bg-white border border-zinc-300 p-5 shadow-sm">
          <h2 className="text-sm font-extrabold text-zinc-800 mb-4 border-b border-zinc-200 pb-2 text-center">Masukkan Data Anda</h2>
          
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setPressed(false); }}
            className="w-full border border-zinc-400 bg-white placeholder:text-zinc-500 focus:outline-none focus:border-[#1B4D3E] py-2 px-3 mb-3 text-xs"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPressed(false); }}
            className="w-full border border-zinc-400 bg-white placeholder:text-zinc-500 focus:outline-none focus:border-[#1B4D3E] py-2 px-3 mb-5 text-xs"
          />
          
          <button
            onClick={() => {
              setPressed(true);
              if (found) {
                setPressed(false);
                router.push(`/login/tenant/${found.tenantID}`);
              }
            }}
            className="w-full text-xs font-bold px-4 py-2.5 border border-[#1B4D3E] bg-[#1B4D3E] text-white hover:opacity-90 cursor-pointer shadow-sm"
          >
            MASUK
          </button>

          {/* PESAN ERROR */}
          {!found && username && password && pressed && (
            <p className="text-[10px] text-red-600 font-bold mt-3 text-center bg-red-100 py-1 border border-red-300">Username atau password salah</p>
          )}
          {(!username || !password) && pressed && (
            <p className="text-[10px] text-red-600 font-bold mt-3 text-center bg-red-100 py-1 border border-red-300">Masukkan username dan password</p>
          )}
        </div>
      </div>
    </div>
  );
}
