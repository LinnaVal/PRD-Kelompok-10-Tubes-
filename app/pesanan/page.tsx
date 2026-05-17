"use client";

import { useState } from "react";
import Image from "next/image";

interface ItemKeranjang {
  nama: string;
  jumlah: number;
  hargaSatuan: number;
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [jumlah, setJumlah] = useState(1);
  const [harga, setHarga] = useState(0);
  const [keranjang, setKeranjang] = useState<ItemKeranjang[]>([]);
  const [isHalamanKeranjang, setIsHalamanKeranjang] = useState(false);
  const [isPopupQR, setIsPopupQR] = useState(false);

  const bukaPopup = (namaMenu: string) => {
    setSelectedMenu(namaMenu);
    setJumlah(1);
    const hargaMin = 10000;
    const hargaMax = 25000;
    const hargaRandom = Math.floor(Math.random() * (hargaMax - hargaMin + 1)) + hargaMin;
    const hargaBulat = Math.round(hargaRandom / 1000) * 1000;
    setHarga(hargaBulat);
    setIsOpen(true);
  };

  const tutupPopup = () => {
    setIsOpen(false);
  };

  const tambahJumlah = () => {
    setJumlah((prev) => prev + 1);
  };

  const kurangJumlah = () => {
    if (jumlah > 1) {
      setJumlah((prev) => prev - 1);
    }
  };

  const masukkanKeKeranjang = () => {
    setKeranjang((prev) => {
      const eksis = prev.find((item) => item.nama === selectedMenu);
      if (eksis) {
        return prev.map((item) =>
          item.nama === selectedMenu
            ? { ...item, jumlah: item.jumlah + jumlah }
            : item
        );
      }
      return [...prev, { nama: selectedMenu, jumlah, hargaSatuan: harga }];
    });
    setIsOpen(false);
  };

  const totalHargaKeranjang = keranjang.reduce(
    (total, item) => total + item.hargaSatuan * item.jumlah,
    0
  );

  const totalItemKeranjang = keranjang.reduce((total, item) => total + item.jumlah, 0);

  const konfirmasiPesanan = () => {
    setIsPopupQR(true);
  };

  const selesaiPembayaran = () => {
    setIsPopupQR(false);
    setKeranjang([]);
    setIsHalamanKeranjang(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-100 font-sans dark:bg-zinc-900">
      <main className="relative flex h-full max-h-screen w-[412px] flex-col items-center justify-start bg-red-600 p-6 shadow-2xl overflow-hidden">
        
        {!isHalamanKeranjang ? (
          <>
            <div className="absolute top-10 right-6 z-10">
              <button 
                onClick={() => setIsHalamanKeranjang(true)}
                className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-lime-400 bg-white shadow-md active:scale-95 transition duration-150 flex items-center justify-center"
              >
                <Image 
                  src="/images (1).png" 
                  alt="Keranjang" 
                  fill 
                  className="object-cover rounded-full" 
                />
                {totalItemKeranjang > 0 && (
                  <div className="absolute -top-1 -right-1 bg-orange-500 border border-white text-[10px] font-black text-white w-5 h-5 rounded-full flex items-center justify-center shadow animate-bounce">
                    {totalItemKeranjang}
                  </div>
                )}
              </button>
            </div>

            <div className="mt-12 mb-10">
              <h1 className="text-xl font-black tracking-widest uppercase text-lime-500">
                Tenant 1
              </h1>
            </div>

            <div className="grid grid-cols-3 gap-x-4 gap-y-6 w-full max-w-[280px] px-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div key={num} className="flex flex-col items-center gap-2">
                  <div 
                    onClick={() => bukaPopup(`Menu ${num}`)}
                    className="aspect-square w-full rounded-2xl bg-white/20 border-2 border-dashed border-white/40 flex items-center justify-center overflow-hidden hover:bg-white/30 transition duration-200 cursor-pointer relative"
                  >
                    <Image src="/images (5).jfif" alt={`Menu ${num}`} fill className="object-cover" />
                  </div>
                  <span className="text-xs font-bold text-lime-400 tracking-wide">Menu {num}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col justify-between pt-10 pb-4">
            
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => setIsHalamanKeranjang(false)}
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white font-black text-xs flex items-center justify-center hover:bg-white/20 transition active:scale-95"
                >
                  ✕
                </button>
                <h1 className="text-xl font-black tracking-widest uppercase text-lime-500">
                  Keranjang Belanja
                </h1>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[60vh]">
                {keranjang.length === 0 ? (
                  <div className="text-center text-red-200/60 pt-20 font-medium text-sm">
                    Keranjang masih kosong nih...
                  </div>
                ) : (
                  keranjang.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between bg-white/10 border border-white/10 rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black text-white uppercase tracking-wide">
                          {item.nama}
                        </span>
                        <span className="text-[11px] font-bold text-red-200/80">
                          Rp {item.hargaSatuan.toLocaleString("id-ID")} / porsi
                        </span>
                      </div>

                      <div className="text-right flex flex-col gap-0.5">
                        <span className="text-xs font-black text-amber-400">
                          {item.jumlah}x Porsi
                        </span>
                        <span className="text-sm font-black text-white tracking-wide">
                          Rp {(item.hargaSatuan * item.jumlah).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="w-full flex flex-col gap-4 pt-4 border-t border-white/10 mt-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-red-200 uppercase tracking-wider">
                  Total Pembayaran:
                </span>
                <span className="text-lg font-black text-amber-400 tracking-wide">
                  Rp {totalHargaKeranjang.toLocaleString("id-ID")}
                </span>
              </div>

              <button 
                disabled={keranjang.length === 0}
                onClick={konfirmasiPesanan}
                className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-500/40 disabled:text-zinc-400 disabled:cursor-not-allowed text-white font-black tracking-widest text-sm shadow-lg transition active:scale-[0.98] uppercase"
              >
                Konfirmasi Pesanan
              </button>
            </div>

          </div>
        )}

        {isOpen && (
          <div 
            onClick={tutupPopup}
            className={`absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 duration-200 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-[360px] bg-red-600 border-4 border-lime-500 rounded-3xl p-5 shadow-2xl relative flex flex-col gap-6 duration-200 ${isOpen ? "scale-100" : "scale-50"}`}
            >
              
              <div className="flex w-full items-start gap-4 text-left">
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                    <Image src="/images (5).jfif" alt={selectedMenu} fill className="object-cover" />
                  </div>
                  <h2 className="text-sm font-black tracking-wide text-white uppercase max-w-[90px] text-center truncate">
                    {selectedMenu}
                  </h2>
                </div>

                <div className="flex-1 pt-1">
                  <p className="text-xs font-medium text-red-100/80 leading-relaxed max-h-[60px] overflow-y-auto pr-1">
                    Deskripsi lezat mengenai hidangan spesial dari Tenant 1 siap disajikan di sini.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center justify-between w-full px-1">
                  <span className="text-base font-black text-amber-400 tracking-wide">
                    Rp {harga.toLocaleString("id-ID")}
                  </span>

                  <div className="flex items-center gap-4 bg-white/10 px-3 py-1.5 rounded-2xl border border-white/10">
                    <button 
                      onClick={kurangJumlah}
                      className="w-7 h-7 rounded-lg bg-orange-500 text-white font-black text-base flex items-center justify-center shadow hover:bg-orange-600 transition active:scale-95 select-none"
                    >
                      -
                    </button>
                    
                    <span className="text-sm font-black text-amber-400 w-5 text-center select-none">
                      {jumlah}
                    </span>

                    <button 
                      onClick={tambahJumlah}
                      className="w-7 h-7 rounded-lg bg-lime-500 text-white font-black text-base flex items-center justify-center shadow hover:bg-lime-600 transition active:scale-95 select-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button 
                  onClick={masukkanKeKeranjang}
                  className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black tracking-wide text-sm shadow-lg transition active:scale-[0.98] uppercase"
                >
                  Masukkan ke Keranjang
                </button>
              </div>

            </div>
          </div>
        )}

        {isPopupQR && (
          <div 
            onClick={() => setIsPopupQR(false)}
            className={`absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 duration-200 ${isPopupQR ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-[340px] bg-red-600 border-4 border-lime-500 rounded-3xl p-6 shadow-2xl text-center relative flex flex-col items-center justify-center gap-5 duration-200 ${isPopupQR ? "scale-100" : "scale-50"}`}
            >
              <h2 className="text-lg font-black tracking-widest text-white uppercase">
                Pindai Pembayaran
              </h2>
              
              <div className="relative w-48 h-48 bg-white p-3 rounded-2xl shadow-inner flex items-center justify-center border-2 border-white/20">
                <div className="relative w-full h-full">
                  <Image 
                    src="/qr.svg" 
                    alt="QR Code Pembayaran" 
                    fill 
                    className="object-contain" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-red-200 uppercase tracking-wider">
                  Total Tagihan:
                </span>
                <span className="text-xl font-black text-amber-400 tracking-wide">
                  Rp {totalHargaKeranjang.toLocaleString("id-ID")}
                </span>
              </div>

              <button 
                onClick={selesaiPembayaran}
                className="w-full h-12 rounded-2xl bg-lime-500 hover:bg-lime-600 text-white font-black tracking-widest text-sm shadow-lg transition active:scale-[0.98] uppercase"
              >
                Selesai Bayar
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
