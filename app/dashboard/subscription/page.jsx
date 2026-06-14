"use client";

import { useState } from "react";
import { Check, Shield, Zap, Crown, ArrowRight, Star } from "lucide-react";

export default function SubscriptionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // User's current plan ID
  const currentPlanId = "starter";

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "$0",
      period: "/forever",
      returnRate: "45% - 55%",
      description: "Perfect for beginners exploring the platform.",
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      features: [
        "45% - 55% Monthly Profit Return",
        "Standard Withdrawals (24-48h)",
        "Basic Customer Support",
        "Standard Investment Limits",
      ],
      color: "emerald",
    },
    {
      id: "growth",
      name: "Growth",
      price: "$50",
      period: "/month",
      returnRate: "60% - 70%",
      description: "For serious investors looking to accelerate wealth.",
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      features: [
        "60% - 70% Monthly Profit Return",
        "Fast Withdrawals (under 12h)",
        "Priority Customer Support",
        "Higher Investment Limits",
        "Exclusive Market Insights",
      ],
      color: "yellow",
      popular: true,
    },
    {
      id: "apex",
      name: "Apex",
      price: "$100",
      period: "/month",
      returnRate: "80% - 90%",
      description: "The ultimate plan for maximum returns and VIP treatment.",
      icon: <Crown className="w-6 h-6 text-purple-400" />,
      features: [
        "80% - 90% Monthly Profit Return",
        "Instant Withdrawals",
        "24/7 VIP Account Manager",
        "Unlimited Investment Capacity",
        "Early Access to New Offers",
        "Zero Withdrawal Fees",
      ],
      color: "purple",
    },
  ];

  const handleSubscribe = (planId) => {
    if (planId === currentPlanId) return;
    
    setSelectedPlan(planId);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSelectedPlan(null);
      alert('Subscription upgrade requested successfully!');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fadeInUp px-4 lg:px-8 max-w-7xl mx-auto pb-10 mt-6 lg:mt-0">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-white mb-4">Choose Your Subscription</h1>
        <p className="text-gray-400">
          Upgrade your account to unlock higher profit returns, faster withdrawals, and premium features. 
          Choose the plan that fits your investment goals.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const isProcessing = isLoading && selectedPlan === plan.id;
          
          return (
            <div 
              key={plan.id}
              className={`relative bg-black/40 rounded-2xl border transition-all duration-300 flex flex-col h-full backdrop-blur-sm
                ${isCurrent ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-gray-800 hover:border-emerald-500/30'}
                ${plan.popular ? 'md:-translate-y-4' : ''}
              `}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-yellow-500/25">
                    <Star className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrent && (
                <div className="absolute top-4 right-4">
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="p-8 border-b border-gray-800">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-${plan.color}-500/10 border border-${plan.color}-500/20`}>
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-400 min-h-[40px]">{plan.description}</p>
                
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 font-medium">{plan.period}</span>
                </div>
              </div>

              <div className="p-8 flex-grow flex flex-col">
                {/* Highlighted Return Rate */}
                <div className={`bg-${plan.color}-500/5 border border-${plan.color}-500/20 rounded-lg p-4 mb-6 flex items-center justify-between`}>
                  <span className="text-sm text-gray-300 font-medium">Profit Return</span>
                  <span className={`text-lg font-bold text-${plan.color}-400`}>{plan.returnRate}</span>
                </div>

                <ul className="space-y-4 flex-grow mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 text-${plan.color === 'emerald' ? 'emerald' : plan.color === 'yellow' ? 'yellow' : 'purple'}-400`} />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrent || isLoading}
                  className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                    ${isCurrent 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default' 
                      : plan.popular 
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:shadow-lg hover:shadow-yellow-500/25'
                        : plan.id === 'apex'
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-lg hover:shadow-emerald-500/25'
                    }
                    ${isLoading && !isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isCurrent ? (
                    'Active Plan'
                  ) : (
                    <>
                      Upgrade to {plan.name}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        
        /* Utility classes for dynamic colors since Tailwind doesn't compile dynamic interpolation well without safelist */
        .bg-emerald-500\\/10 { background-color: rgba(16, 185, 129, 0.1); }
        .border-emerald-500\\/20 { border-color: rgba(16, 185, 129, 0.2); }
        .text-emerald-400 { color: rgb(52, 211, 153); }
        .bg-emerald-500\\/5 { background-color: rgba(16, 185, 129, 0.05); }
        
        .bg-yellow-500\\/10 { background-color: rgba(234, 179, 8, 0.1); }
        .border-yellow-500\\/20 { border-color: rgba(234, 179, 8, 0.2); }
        .text-yellow-400 { color: rgb(250, 204, 21); }
        .bg-yellow-500\\/5 { background-color: rgba(234, 179, 8, 0.05); }
        
        .bg-purple-500\\/10 { background-color: rgba(168, 85, 247, 0.1); }
        .border-purple-500\\/20 { border-color: rgba(168, 85, 247, 0.2); }
        .text-purple-400 { color: rgb(192, 132, 252); }
        .bg-purple-500\\/5 { background-color: rgba(168, 85, 247, 0.05); }
      `}</style>
    </div>
  );
}
