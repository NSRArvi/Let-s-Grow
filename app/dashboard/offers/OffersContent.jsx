'use client'

import { Bitcoin, Gem, Leaf, Tv, Cpu, Server, ShieldCheck, MonitorSmartphone } from 'lucide-react'

const upcomingOffers = [
  {
    title: "🎁 Buy 1 Get 1 Free",
    description: "Get an extra unit free with every purchase!",
    startDate: "2025-07-10",
    endDate: "2025-07-15",
    products: [
      {
        id: 101,
        name: "Bitcoin Investment",
        price: 10,
        icon: <Bitcoin className="text-yellow-400 w-6 h-6" />
      },
      {
        id: 102,
        name: "Litecoin Plan",
        price: 12,
        icon: <Bitcoin className="text-slate-400 w-6 h-6" />
      },
      {
        id: 102,
        name: "Litecoin Plan",
        price: 12,
        icon: <Bitcoin className="text-slate-400 w-6 h-6" />
      },
    ],
  },
  {
    title: "🎉 Buy 2 Get 1 Free",
    description: "Buy any 2, get 1 completely free on us!",
    startDate: "2025-07-12",
    endDate: "2025-07-18",
    products: [
      {
        id: 201,
        name: "Organic Farm Stock",
        price: 25,
        icon: <Leaf className="text-green-500 w-6 h-6" />
      },
      {
        id: 202,
        name: "Hydroponic Kit Stock",
        price: 18,
        icon: <Leaf className="text-green-400 w-6 h-6" />
      },
      {
        id: 203,
        name: "Hydroponic Kit Stock",
        price: 18,
        icon: <Leaf className="text-green-400 w-6 h-6" />
      },
    ],
  },
  {
    title: "💰 100% Return Offer",
    description: "Double your money with our 100% return plans!",
    startDate: "2025-07-15",
    endDate: "2025-07-22",
    products: [
      {
        id: 301,
        name: "Luxury Gem Investment",
        price: 70,
        icon: <Gem className="text-pink-400 w-6 h-6" />
      },
      {
        id: 302,
        name: "Palladium Vault",
        price: 90,
        icon: <Gem className="text-slate-200 w-6 h-6" />
      },
      {
        id: 303,
        name: "Palladium Vault",
        price: 90,
        icon: <Gem className="text-slate-200 w-6 h-6" />
      },
    ],
  },
]

export default function UpcomingOffersPage() {
  return (
    <div className="py-10 px-4 lg:px-8 animate-fadeInUp">
      <h1 className="text-3xl font-bold text-white mb-6">Upcoming Investment Offers</h1>

      {upcomingOffers.map((offer, idx) => (
        <div
          key={idx}
          className="mb-10 bg-black/20 border border-emerald-500/30 rounded-xl p-6 shadow-md hover:shadow-xl transition"
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-emerald-400">{offer.title}</h2>
            <p className="text-gray-300 text-sm">{offer.description}</p>
            <p className="text-gray-400 text-xs mt-1">
              Valid from <span className="text-white">{offer.startDate}</span> to{" "}
              <span className="text-white">{offer.endDate}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {offer.products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 bg-black/30 border border-emerald-500/10 p-4 rounded-lg hover:border-emerald-500 transition-all"
              >
                <div className="bg-emerald-500/10 p-4 rounded-full">{product.icon}</div>
                <div className="flex flex-col">
                  <h3 className="text-white font-semibold text-base">{product.name}</h3>
                  <p className="text-sm text-gray-400">Price: ${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

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
  )
}
