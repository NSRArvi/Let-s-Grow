"use client";

import { useState } from "react";
import {
    CreditCard,
    ArrowDownToLine,
    ArrowUpToLine,
    Send,
    Banknote,
    Wallet,
    Clock,
} from "lucide-react";

export default function WalletPage() {
    const [cashIn, setCashIn] = useState({ method: "bkash", amount: "", trxId: "" });
    const [withdraw, setWithdraw] = useState({ method: "bkash", number: "", amount: "" });

    const handleCashIn = (e) => {
        e.preventDefault();
        console.log("Cash In Info:", cashIn);
    };

    const handleWithdraw = (e) => {
        e.preventDefault();
        console.log("Withdraw Info:", withdraw);
    };

    return (
        <div className="space-y-10 animate-fadeInUp">
            <h1 className="text-3xl font-bold text-white">Wallet</h1>
            <p className="text-gray-400 text-sm mb-6">Manage your wallet, add funds or withdraw anytime.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/30 p-6 rounded-xl border border-emerald-500/20">
                    <div className="flex items-center gap-4">
                        <Wallet className="w-6 h-6 text-emerald-400" />
                        <div>
                            <p className="text-sm text-gray-400">Current Balance</p>
                            <p className="text-2xl font-bold text-white">$880</p>
                        </div>
                    </div>
                </div>

                <div className="bg-black/30 p-6 rounded-xl border border-emerald-500/20">
                    <div className="flex items-center gap-4">
                        <Banknote className="w-6 h-6 text-green-400" />
                        <div>
                            <p className="text-sm text-gray-400">Total Invested</p>
                            <p className="text-2xl font-bold text-white">$1,500</p>
                        </div>
                    </div>
                </div>

                <div className="bg-black/30 p-6 rounded-xl border border-emerald-500/20">
                    <div className="flex items-center gap-4">
                        <Send className="w-6 h-6 text-yellow-400" />
                        <div>
                            <p className="text-sm text-gray-400">Total Withdrawn</p>
                            <p className="text-2xl font-bold text-white">$620</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <form
                    onSubmit={handleCashIn}
                    className="bg-black/30 p-6 rounded-xl border border-emerald-500/20 space-y-4"
                >
                    <div className="flex items-center gap-3 text-emerald-400 font-semibold">
                        <ArrowDownToLine className="w-5 h-5" /> Cash In
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white mb-1 block">Select Method</label>
                        <select
                            className="appearance-none w-full bg-black/40 text-white p-3 rounded-md border border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={cashIn.method}
                            onChange={(e) => setCashIn({ ...cashIn, method: e.target.value })}
                        >
                            <option value="bkash">Bkash</option>
                            <option value="nagad">Nagad</option>
                            <option value="rocket">Rocket</option>
                            <option value="stripe">Stripe</option>
                        </select>
                    </div>

                    <div className="text-sm text-gray-300 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-md">
                        Send your selected amount to <strong>01554915902</strong> via <span className="capitalize">{cashIn.method}</span> first. Then fill in the fields below.
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white mb-1 block">Transaction ID</label>
                        <input
                            type="text"
                            className="w-full bg-black/40 text-white p-3 rounded-md border border-emerald-500/20"
                            value={cashIn.trxId}
                            onChange={(e) => setCashIn({ ...cashIn, trxId: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white mb-1 block">Amount (USD)</label>
                        <input
                            type="number"
                            className="w-full bg-black/40 text-white p-3 rounded-md border border-emerald-500/20"
                            value={cashIn.amount}
                            onChange={(e) => setCashIn({ ...cashIn, amount: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 transition-colors text-white py-3 rounded-lg font-bold"
                    >
                        Submit Cash In
                    </button>
                </form>

                <form
                    onSubmit={handleWithdraw}
                    className="bg-black/30 p-6 rounded-xl border border-emerald-500/20 space-y-4"
                >
                    <div className="flex items-center gap-3 text-yellow-400 font-semibold">
                        <ArrowUpToLine className="w-5 h-5" /> Withdraw
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white mb-1 block">MFS Type</label>
                        <select
                            className="appearance-none w-full bg-black/40 text-white p-3 rounded-md border border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            value={withdraw.method}
                            onChange={(e) => setWithdraw({ ...withdraw, method: e.target.value })}
                        >
                            <option value="bkash">Bkash</option>
                            <option value="nagad">Nagad</option>
                            <option value="rocket">Rocket</option>
                        </select>
                    </div>

                    <div className="text-sm text-gray-300 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-md">
                        Balance will be send using selected payment type. Then fill all the fields carefully.
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white mb-1 block">MFS Number</label>
                        <input
                            type="text"
                            className="w-full bg-black/40 text-white p-3 rounded-md border border-emerald-500/20"
                            value={withdraw.number}
                            onChange={(e) => setWithdraw({ ...withdraw, number: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white mb-1 block">Amount (USD)</label>
                        <input
                            type="number"
                            className="w-full bg-black/40 text-white p-3 rounded-md border border-emerald-500/20"
                            value={withdraw.amount}
                            onChange={(e) => setWithdraw({ ...withdraw, amount: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-yellow-600 hover:bg-yellow-500 transition-colors text-white py-3 rounded-lg font-bold"
                    >
                        Submit Withdraw
                    </button>
                </form>
            </div>

            <div className="bg-black/30 p-6 rounded-xl border border-emerald-500/20 overflow-x-auto">
                <h2 className="text-xl font-bold text-white mb-4">Transaction History</h2>
                <table className="min-w-full text-sm text-left text-gray-300">
                    <thead className="text-xs uppercase text-emerald-400 border-b border-emerald-500/10">
                        <tr>
                            <th scope="col" className="py-3 px-4">Type</th>
                            <th scope="col" className="py-3 px-4">Amount</th>
                            <th scope="col" className="py-3 px-4">Date</th>
                            <th scope="col" className="py-3 px-4">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-500/10">
                        <tr>
                            <td className="py-3 px-4">Cash In via Bkash</td>
                            <td className="py-3 px-4 text-emerald-400">+ $100</td>
                            <td className="py-3 px-4">2025-07-03</td>
                            <td className="py-3 px-4">10:45 AM</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4">Withdraw to Nagad</td>
                            <td className="py-3 px-4 text-red-400">- $80</td>
                            <td className="py-3 px-4">2025-07-02</td>
                            <td className="py-3 px-4">3:10 PM</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4">Bonus Added</td>
                            <td className="py-3 px-4 text-emerald-300">+ $20</td>
                            <td className="py-3 px-4">2025-07-01</td>
                            <td className="py-3 px-4">8:00 AM</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4">Withdraw to Rocket</td>
                            <td className="py-3 px-4 text-red-400">- $120</td>
                            <td className="py-3 px-4">2025-06-29</td>
                            <td className="py-3 px-4">6:40 PM</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4">Cash In via Nagad</td>
                            <td className="py-3 px-4 text-emerald-400">+ $50</td>
                            <td className="py-3 px-4">2025-06-28</td>
                            <td className="py-3 px-4">1:25 PM</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
        </div>
    );
}
