"use client";
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ArrowRight, Star, Zap, DollarSign } from 'lucide-react';

export default function TopAssetsSection() {
    const [selectedAsset, setSelectedAsset] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const assets = [
        {
            id: 1,
            name: "Bitcoin",
            symbol: "BTC",
            icon: "₿",
            price: "$45,230.00",
            change: "+5.2%",
            changeValue: "+$2,234",
            isPositive: true,
            volume: "$2.5B",
            marketCap: "$890B",
            rating: 4.8,
            risk: "Medium",
            description: "The world's first and largest cryptocurrency by market cap"
        },
        {
            id: 2,
            name: "Ethereum",
            symbol: "ETH",
            icon: "Ξ",
            price: "$3,120.00",
            change: "+3.8%",
            changeValue: "+$115",
            isPositive: true,
            volume: "$1.8B",
            marketCap: "$375B",
            rating: 4.9,
            risk: "Medium",
            description: "Leading smart contract platform powering DeFi and NFTs"
        },
        {
            id: 3,
            name: "Cardano",
            symbol: "ADA",
            icon: "₳",
            price: "$0.45",
            change: "-2.1%",
            changeValue: "-$0.01",
            isPositive: false,
            volume: "$450M",
            marketCap: "$15.2B",
            rating: 4.3,
            risk: "High",
            description: "Proof-of-stake blockchain platform focused on sustainability"
        },
        {
            id: 4,
            name: "Solana",
            symbol: "SOL",
            icon: "◎",
            price: "$98.50",
            change: "+7.3%",
            changeValue: "+$6.7",
            isPositive: true,
            volume: "$890M",
            marketCap: "$42.1B",
            rating: 4.5,
            risk: "High",
            description: "High-performance blockchain supporting fast transactions"
        },
        {
            id: 5,
            name: "Polkadot",
            symbol: "DOT",
            icon: "●",
            price: "$6.80",
            change: "+4.1%",
            changeValue: "+$0.27",
            isPositive: true,
            volume: "$320M",
            marketCap: "$8.5B",
            rating: 4.2,
            risk: "High",
            description: "Multi-chain protocol enabling blockchain interoperability"
        },
        {
            id: 6,
            name: "Chainlink",
            symbol: "LINK",
            icon: "⬟",
            price: "$14.25",
            change: "+1.9%",
            changeValue: "+$0.27",
            isPositive: true,
            volume: "$510M",
            marketCap: "$7.6B",
            rating: 4.4,
            risk: "Medium",
            description: "Decentralized oracle network connecting blockchains to real-world data"
        }
    ];


    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setSelectedAsset((prev) => (prev + 1) % assets.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);
    

    return (
        <section className="py-20 bg-gradient-to-b from-[#F8FAFC] to-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-[#0F172A] mb-4">
                        Invest in Tomorrow's
                        <span className="bg-gradient-to-r from-[#2563EB] to-[#10B981] bg-clip-text text-transparent"> Winners</span>
                    </h2>
                    <p className="text-xl text-[#475569] max-w-3xl mx-auto font-medium">
                        Our AI analyzes thousands of digital assets to identify the most promising investment opportunities
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Asset List */}
                    <div className="lg:col-span-2 space-y-4">
                        {assets.map((asset, index) => (
                            <div
                                key={asset.id}
                                className={`bg-white rounded-xl p-6 border transition-all duration-500 cursor-pointer transform shadow-sm ${selectedAsset === index
                                        ? isVisible
                                            ? 'border-[#2563EB] bg-blue-50/50 scale-100 opacity-100 ring-1 ring-[#2563EB]/20'
                                            : 'opacity-0 scale-95'
                                        : 'border-[#E2E8F0] hover:border-[#CBD5E1] opacity-70 hover:opacity-100'
                                    }`}
                                onClick={() => setSelectedAsset(index)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-[#0F172A] rounded-full size-12 p-3 text-white font-bold text-2xl flex justify-center items-center shadow-md">
                                            {asset.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-[#0F172A] font-bold text-lg">{asset.name}</h3>
                                            <p className="text-[#475569] font-medium">{asset.symbol}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-[#0F172A] font-bold text-xl">{asset.price}</div>
                                        <div className={`flex items-center space-x-1 justify-end ${asset.isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'
                                            }`}>
                                            {asset.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                            <span className="font-bold text-sm">{asset.change}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4 bg-[#E2E8F0] rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-[#2563EB] to-[#10B981] h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${(asset.rating / 5) * 100}%` }}
                                    ></div>
                                </div>

                                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-[#94A3B8] font-medium">Volume</p>
                                        <p className="text-[#0F172A] font-bold">{asset.volume}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#94A3B8] font-medium">Market Cap</p>
                                        <p className="text-[#0F172A] font-bold">{asset.marketCap}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#94A3B8] font-medium">Risk Level</p>
                                        <p className={`font-bold ${asset.risk === 'Low' ? 'text-[#10B981]' :
                                                asset.risk === 'Medium' ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                                            }`}>{asset.risk}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Asset Details */}
                    <div className="space-y-6">
                        {/* Featured Asset Card */}
                        <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24">
                            <div className="text-center mb-6">
                                <div className="bg-[#0F172A] rounded-full size-16 p-4 flex justify-center items-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg">
                                    {assets[selectedAsset].icon}
                                </div>
                                <h3 className="text-2xl font-bold text-[#0F172A] mb-2">{assets[selectedAsset].name}</h3>
                                <p className="text-[#475569] mb-4 font-medium">{assets[selectedAsset].description}</p>

                                {/* Rating */}
                                <div className="flex justify-center items-center space-x-2 mb-6">
                                    <div className="flex space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < Math.floor(assets[selectedAsset].rating)
                                                        ? 'text-[#F59E0B] fill-current'
                                                        : 'text-[#E2E8F0]'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[#0F172A] font-bold">{assets[selectedAsset].rating}</span>
                                </div>
                            </div>

                            {/* Price Info */}
                            <div className="space-y-4 mb-6 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                                <div className="flex justify-between items-center">
                                    <span className="text-[#475569] font-medium">Current Price</span>
                                    <span className="text-[#0F172A] font-bold text-xl">{assets[selectedAsset].price}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#475569] font-medium">24h Change</span>
                                    <span className={`font-bold ${assets[selectedAsset].isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'
                                        }`}>
                                        {assets[selectedAsset].change} ({assets[selectedAsset].changeValue})
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button className="w-full bg-[#2563EB] text-white py-3.5 px-4 rounded-xl font-bold hover:bg-[#1D4ED8] transition-all duration-200 shadow-[0_4px_12px_rgba(37,99,235,0.2)] flex items-center justify-center space-x-2">
                                    <DollarSign className="h-5 w-5" />
                                    <span>Invest Now</span>
                                </button>
                                <button className="w-full bg-white text-[#0F172A] py-3.5 px-4 rounded-xl font-bold border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm">
                                    <Zap className="h-5 w-5 text-[#2563EB]" />
                                    <span>Add to Watchlist</span>
                                </button>
                            </div>
                        </div>

                        {/* Market Summary */}
                        <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm">
                            <h4 className="text-[#0F172A] font-bold mb-4">Market Summary</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-[#475569] font-medium">Total Market Cap</span>
                                    <span className="text-[#0F172A] font-bold">$1.2T</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#475569] font-medium">24h Volume</span>
                                    <span className="text-[#0F172A] font-bold">$45.2B</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#475569] font-medium">Market Sentiment</span>
                                    <span className="text-[#10B981] font-bold">Bullish</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}