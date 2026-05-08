import React, { useState } from 'react';
import axios from 'axios';

export default function DomainCard({ item }) {
    const [isRechecking, setIsRechecking] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(item.available);

    const formattedPrice = (price) => 
        new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(parseFloat(price));

    const handleRecheck = async () => {
        setIsRechecking(true);
        try {
            const response = await axios.post('https://dev-whois.jagoanhosting.com/api/v2/whois', 
                { domain: item.name },
                { headers: { 'X-WHOIS-AUTH': 'RMD5fgD2JH8XhCIJ' }}
            );
            setCurrentStatus(response.data.data.is_available);
        } catch (err) {
            console.error("Gagal cek ulang domain", err);
        } finally {
            setIsRechecking(false);
        }
    };

    return (
        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition border-b last:border-none">
            {/* Sisi Kiri: Info Nama Domain */}
            <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border shrink-0 ${
                    currentStatus ? 'bg-green-100 text-green-600 border-green-200' : 'bg-white text-gray-300 border-gray-200'
                }`}>
                    {currentStatus ? '✓' : 'ⓘ'}
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium ${currentStatus ? 'text-gray-800' : 'text-gray-400'}`}>
                        {item.name}
                    </span>
                    {item.isSpotlight && (
                        <span className="bg-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            Pilihan Terbaik
                        </span>
                    )}
                </div>
            </div>

            {/* Sisi Kanan: Harga ATAU Status & Button Cek Ulang */}
            <div className="flex items-center justify-between md:justify-end gap-6 mt-4 md:mt-0">
                
                {currentStatus ? (
                    /* TAMPILAN JIKA TERSEDIA */
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            {item.gimmick && (
                                <p className="text-xs text-gray-400 line-through">Rp {formattedPrice(item.gimmick)}</p>
                            )}
                            <p className="text-gray-900 font-bold text-sm">
                                Rp {formattedPrice(item.price)}
                                <span className="text-[10px] text-gray-500 font-normal ml-0.5">/thn</span>
                            </p>
                        </div>
                        <button className="bg-[#EB652A] hover:bg-orange-600 text-white px-10 py-2.5 rounded-lg text-sm font-bold transition shadow-sm whitespace-nowrap active:scale-95">
                            🛒 Tambah
                        </button>
                    </div>
                ) : (
                    /* TAMPILAN JIKA TIDAK TERSEDIA */
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-red-500 font-medium italic bg-red-50 px-2 py-1 rounded">
                            Domain tidak tersedia
                        </span>
                        
                        <button 
                            onClick={handleRecheck}
                            disabled={isRechecking}
                            className="bg-gray-200 border border-gray-300 text-gray-700 px-6 py-2 rounded-lg text-xs font-bold transition hover:bg-gray-50 hover:border-gray-400 shadow-sm flex items-center gap-2 disabled:opacity-50 active:scale-95"
                        >
                            {isRechecking ? (
                                <div className="h-3 w-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Cek Ulang
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}