import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import DomainCard from "../Components/Domain/DomainCard";

export default function DomainSearch() {
    const [config, setConfig] = useState(null);
    const [extensions, setExtensions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [visibleLimit, setVisibleLimit] = useState(15);

    useEffect(() => {
        axios.get("/api/domain/config").then((res) => {
            const responseData = res.data.data;
            setConfig(responseData.config);
            setExtensions(responseData.extensions);
            setVisibleLimit(
                parseInt(responseData.config.SEARCH_DOMAIN_LIMIT_SHOW_DOMAIN),
            );
        });
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery) return;

        setIsLoading(true);
        setResults([]);

        const pureName = searchQuery.split(".")[0];
        const tempResults = [];

        for (const ext of extensions) {
            const fullDomain = `${pureName}.${ext.extension}`;
            try {
                const response = await axios.post(
                    "https://dev-whois.jagoanhosting.com/api/v2/whois",
                    { domain: fullDomain },
                    { headers: { "X-WHOIS-AUTH": "RMD5fgD2JH8XhCIJ" } },
                );

                tempResults.push({
                    name: fullDomain,
                    available: response.data.data.is_available,
                    price: ext.register[0],
                    gimmick: ext.gimmick_price,
                    isSpotlight: config?.SEARCH_DOMAIN_SPOTLIGHT.includes(
                        `.${ext.extension}`,
                    ),
                });

                setResults([...tempResults]);
            } catch (err) {
                console.error(`Error checking ${fullDomain}`);
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] font-sans">
            <Head title="Cari Domain - Jagoan Hosting" />

        <nav className="bg-[#F9FAFB]  px-6 py-6">
    <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Sisi Kiri: Logo & Menu */}
        <div className="flex items-center gap-8">
            <img src="/logo.png" alt="Logo" className="h-8" />
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
                <a href="#" className="flex items-center gap-1.5 text-[16px] font-semibold text-gray-700 hover:text-orange-600 transition">
                    Website
                    <span className="bg-orange-100 text-orange-600 text-[9px] px-1.5 py-0.5 mt-2 rounded font-bold uppercase tracking-wider border border-orange-200">
                        New
                    </span>
                </a>
                <a href="#" className="text-[16px] font-semibold text-gray-700 hover:text-orange-600 transition">
                    Hosting
                </a>
                <a href="#" className="text-[16px] font-semibold text-gray-700 hover:text-orange-600 transition">
                    Domain
                </a>
                <a href="#" className="text-[16px] font-semibold text-gray-700 hover:text-orange-600 transition">
                    VPS
                </a>
                <a href="#" className="text-[16px] font-semibold text-gray-700 hover:text-orange-600 transition">
                    Email
                </a>
                <a href="#" className="text-[16px] font-semibold text-gray-700 hover:text-orange-600 transition">
                    Add-on
                </a>
            </div>
        </div>

        {/* Sisi Kanan: Login Button */}
        <button className="text-[16px] font-semibold  rounded-full border-1 border-gray-300 px-5 py-2 hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95">
            Login
        </button>
    </div>
</nav>

            {/* Search Section - max-w-4xl agar sejajar dengan bawah */}
            <div className="bg-[#F9FAFB] py-10 px-6 border-b border-gray-200">
                <div className="max-w-4xl mx-auto">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col md:flex-row gap-4 items-center"
                    >
                        <div className="relative flex-1 w-full group">
                            <input
                                type="text"
                                placeholder="Cari nama domain (misal: bisnismu.com)"
                                className="w-full p-3 pr-10 outline-none text-sm border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all bg-white shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full md:w-auto bg-[#2D2D2D] hover:bg-black text-white px-8 py-3 rounded-lg font-bold transition-all disabled:opacity-50 shadow-sm active:scale-95 whitespace-nowrap text-sm"
                        >
                            {isLoading ? "Mencari..." : "Cek Domain"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Results Area - Menggunakan max-w-4xl yang sama */}
            <div className="max-w-4xl mx-auto py-12 px-6">
                {results.length > 0 && (
                    <>
                        <h3 className="text-lg font-bold text-gray-800 mb-6">
                            Rekomendasi ekstensi domain lainnya
                        </h3>

                        {/* Table/List Wrapper */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
                            {results.slice(0, visibleLimit).map((item, idx) => (
                                <DomainCard key={idx} item={item} />
                            ))}
                        </div>

                        {/* Load More Button - Dibuat W-FULL agar lebarnya sama dengan tabel */}
                        {results.length > visibleLimit && (
                            <div className="mt-8 w-full">
                                <button
                                    onClick={() => setVisibleLimit((prev) => prev + 10)}
                                    className="w-full bg-[#2D2D2D] text-white py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-black hover:shadow-lg transition active:scale-[0.99]"
                                >
                                    Tampilkan lebih banyak domain{" "}
                                    <span className="text-[10px]">▼</span>
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Info Box Bottom - Juga otomatis mengikuti max-w-4xl */}
                <div className="mt-16 bg-white p-6 rounded-2xl border border-dashed border-gray-300 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-orange-50 p-3 rounded-xl">💡</div>
                        <p className="text-sm text-gray-600">
                            <strong>STOP Bingung!</strong> Generator ini Bisa{" "}
                            <span className="text-orange-600">Sulap Domain Kamu Jadi Lebih Menarik</span>
                        </p>
                    </div>
                    <button className="text-gray-600 text-[18px] hover:text-gray-600">→</button>
                </div>
            </div>
        </div>
    );
}