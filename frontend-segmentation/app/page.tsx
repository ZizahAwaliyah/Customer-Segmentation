"use client";

import { useState } from "react";

export default function Home() {
  const [income, setIncome] = useState<number | "">("");
  const [spending, setSpending] = useState<number | "">("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeCustomer = async () => {
    if (income === "" || spending === "") {
      alert("Isi dulu datanya bos! 😅");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://customer-segmentation-inky.vercel.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          income: Number(income), 
          spending: Number(spending) 
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Gagal koneksi ke Backend AI. Pastikan server nyala!");
    } finally {
      setLoading(false);
    }
  };

  // Kamus Warna & Nama untuk setiap Cluster (Hasil AI)
  // Ini mencocokkan angka 0-4 dari Python dengan Bahasa Manusia
  const clusters: any = {
    0: { label: "IMPULSIVE / HEDON 💸", color: "bg-purple-100 text-purple-800 border-purple-500", desc: "Gaji kecil, tapi belanja gila-gilaan. Target empuk promo!" },
    1: { label: "SAVER / HEMAT 💰", color: "bg-green-100 text-green-800 border-green-500", desc: "Sangat irit. Susah ditembus kecuali diskon besar." },
    2: { label: "AVERAGE / STANDAR 😐", color: "bg-gray-100 text-gray-800 border-gray-500", desc: "Orang biasa pada umumnya. Produk standar laku disini." },
    3: { label: "TARGET HEMAT 🎯", color: "bg-blue-100 text-blue-800 border-blue-500", desc: "Gaji besar tapi irit. Perlu 'dirayu' barang berkualitas." },
    4: { label: "SULTAN / VIP 👑", color: "bg-yellow-100 text-yellow-800 border-yellow-500", desc: "Uang banyak, belanja banyak. Tawarkan barang premium!" },
  };

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white tracking-wide">
            📊 AI Customer Scanner
          </h1>
          <p className="text-indigo-200 text-sm mt-1">
            Segmentasi pelanggan otomatis dengan K-Means
          </p>
        </div>

        {/* Form Input */}
        <div className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pendapatan Tahunan (Ribu $)
            </label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-bold text-gray-800 transition"
              placeholder="Contoh: 15, 50, 100..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Skor Pengeluaran (1-100)
            </label>
            <input
              type="number"
              value={spending}
              onChange={(e) => setSpending(Number(e.target.value))}
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-bold text-gray-800 transition"
              placeholder="Contoh: 1-100"
            />
            <p className="text-xs text-gray-400 mt-1">*Semakin besar = semakin boros</p>
          </div>

          <button
            onClick={analyzeCustomer}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            {loading ? "Sedang Menganalisis..." : "🔍 Scan Tipe Pelanggan"}
          </button>

          {/* Hasil Result */}
          {result && clusters[result.cluster_id] && (
            <div className={`mt-6 p-6 rounded-xl border-l-8 animate-fade-in ${clusters[result.cluster_id].color}`}>
              <h2 className="text-xl font-extrabold mb-1">
                {clusters[result.cluster_id].label}
              </h2>
              <p className="font-medium opacity-90 mb-3">
                {clusters[result.cluster_id].desc}
              </p>
              <div className="text-xs uppercase tracking-wider opacity-60 font-bold">
                Cluster ID: {result.cluster_id}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}