// app/page.tsx
import Link from "next/link";
import { TOKO_DATA } from "./data";

export default function TenantPage() {
  return (
    <main className="min-h-screen bg-[#F4F3ED] font-sans text-zinc-950 p-4">
      
      {/* HEADER AREA */}
      <header className="mb-6 border-b border-zinc-300 pb-4">
        <div className="flex items-center gap-3 max-w-md mx-auto mb-4">
          
          {/* PLACEHOLDER PROFIL */}
          <div className="w-10 h-10 bg-zinc-200 border border-zinc-400 rounded-none flex items-center justify-center flex-shrink-0 shadow-sm cursor-pointer hover:bg-zinc-300">
            <span className="text-xl">👤</span>
          </div>

          {/* SEARCH BAR */}
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Cari Tenant..." 
              className="w-full bg-white rounded-none py-2 px-3 outline-none border border-[#1B4D3E] text-sm"
            />
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-extrabold tracking-tight text-[#1B4D3E]">
            DAFTAR TENANT
          </h1>
        </div>
      </header>

      {/* MAIN CONTENT (Grid Tenant) */}
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-4">
          {TOKO_DATA.map((tenant) => {
            return (
              <Link 
                href={`/menu?id=${tenant.tenantID}`} 
                key={tenant.tenantID}
                className="flex flex-col items-center cursor-pointer group"
              >
                {/* MODIFIED: Semua kotak tenant sekarang menggunakan warna Lemon [#FACB1A] */}
                <div className="w-full aspect-square bg-[#FACB1A] border border-zinc-400 rounded-none flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shadow-sm">
                  <span className="text-5xl">
                    {tenant.tenantID === 1 ? "🏪" : "🥩"}
                  </span>
                </div>
                
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-zinc-800 text-center">
                  {tenant.name}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

    </main>
  );
}