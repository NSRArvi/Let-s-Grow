"use client";
import React, { useState, useEffect } from 'react';
import { Star, Quote, ArrowLeft, ArrowRight, TrendingUp, Shield, Users } from 'lucide-react';

export default function ReviewsSection() {
  const [currentReview, setCurrentReview] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Portfolio Manager",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Let's Grow transformed my investment approach completely. The AI insights are incredibly accurate, and I've seen consistent 15% monthly returns. The platform's security gives me peace of mind.",
      investment: "$250K",
      returns: "+47%",
      timeframe: "8 months"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Tech Entrepreneur",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "As someone in tech, I appreciate the sophisticated algorithms behind Let's Grow. The real-time analytics and automated trading features are game-changers. Best investment decision I've made.",
      investment: "$500K",
      returns: "+62%",
      timeframe: "1 year"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Financial Advisor",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "I recommend Let's Grow to all my clients. The platform's risk management is exceptional, and the educational resources helped me understand digital assets better. Truly professional service.",
      investment: "$180K",
      returns: "+38%",
      timeframe: "6 months"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Startup Founder",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "The customer support is outstanding! When I had questions about my portfolio, the team provided detailed explanations. The mobile app makes it easy to monitor investments on the go.",
      investment: "$120K",
      returns: "+41%",
      timeframe: "7 months"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Investment Banker",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      review: "Let's Grow offers institutional-level tools for individual investors. The diversification strategies and automated rebalancing have significantly improved my portfolio performance.",
      investment: "$350K",
      returns: "+55%",
      timeframe: "10 months"
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Retired Engineer",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "At 65, I was hesitant about digital investments. Let's Grow made it simple and secure. The steady returns have enhanced my retirement fund beyond expectations. Highly recommended!",
      investment: "$75K",
      returns: "+29%",
      timeframe: "5 months"
    }
  ];

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(nextReview, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-[#F8FAFC] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-blue-50/50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#0F172A] mb-4">
            What Our Investors
            <span className="bg-gradient-to-r from-[#2563EB] to-[#10B981] bg-clip-text text-transparent"> Say</span>
          </h2>
          <p className="text-xl text-[#475569] max-w-3xl mx-auto font-medium">
            Join thousands of satisfied investors who've transformed their financial future with Let's Grow
          </p>
        </div>

        {/* Reviews Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Review Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col justify-center">
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {reviews[currentReview].name.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < reviews[currentReview].rating
                                ? 'text-[#F59E0B] fill-current'
                                : 'text-[#E2E8F0]'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[#0F172A] font-bold">
                        {reviews[currentReview].rating}.0
                      </span>
                    </div>
                    <blockquote className="text-[#475569] text-lg leading-relaxed mb-6 font-medium italic">
                      <Quote className="h-8 w-8 text-[#2563EB] opacity-20 float-left mr-2 -mt-2" />
                      {reviews[currentReview].review}
                    </blockquote>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto">
                      <div className="mb-4 sm:mb-0">
                        <div className="text-[#0F172A] font-bold text-lg">
                          {reviews[currentReview].name}
                        </div>
                        <div className="text-[#475569]">
                          {reviews[currentReview].role}
                        </div>
                      </div>
                      <div className="text-left sm:text-right bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                        <div className="text-[#10B981] font-bold text-lg">
                          {reviews[currentReview].returns}
                        </div>
                        <div className="text-[#475569] text-sm font-medium">
                          {reviews[currentReview].timeframe}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                <div className="flex space-x-2">
                  {reviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentReview(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentReview
                          ? 'bg-[#2563EB] w-8'
                          : 'bg-[#E2E8F0] hover:bg-[#CBD5E1]'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={prevReview}
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                    className="bg-white text-[#0F172A] p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all duration-200 shadow-sm"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextReview}
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                    className="bg-white text-[#0F172A] p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all duration-200 shadow-sm"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Panel */}
            <div className="space-y-6">
              {/* Performance Stats */}
              <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm">
                <h3 className="text-[#0F172A] font-bold mb-4">Investment Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#475569] font-medium">Total Invested</span>
                    <span className="text-[#2563EB] font-bold">
                      {reviews[currentReview].investment}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#475569] font-medium">Total Returns</span>
                    <span className="text-[#10B981] font-bold">
                      {reviews[currentReview].returns}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#475569] font-medium">Duration</span>
                    <span className="text-[#0F172A] font-bold">
                      {reviews[currentReview].timeframe}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm">
                <h3 className="text-[#0F172A] font-bold mb-4">Why Investors Trust Us</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-50 rounded-full p-2">
                      <TrendingUp className="h-4 w-4 text-[#2563EB]" />
                    </div>
                    <div>
                      <div className="text-[#0F172A] font-bold">89% Success Rate</div>
                      <div className="text-[#475569] text-sm font-medium">Average ROI</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#ECFDF5] rounded-full p-2">
                      <Shield className="h-4 w-4 text-[#10B981]" />
                    </div>
                    <div>
                      <div className="text-[#0F172A] font-bold">Bank-Level Security</div>
                      <div className="text-[#475569] text-sm font-medium">256-bit encryption</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-50 rounded-full p-2">
                      <Users className="h-4 w-4 text-[#2563EB]" />
                    </div>
                    <div>
                      <div className="text-[#0F172A] font-bold">24/7 Support</div>
                      <div className="text-[#475569] text-sm font-medium">Expert assistance</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overall Rating */}
              <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm text-center">
                <div className="text-4xl font-bold text-[#0F172A] mb-2">4.8</div>
                <div className="flex justify-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < 4 ? 'text-[#F59E0B] fill-current' : 'text-[#E2E8F0]'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-[#475569] font-medium">Based on 2,847 reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}