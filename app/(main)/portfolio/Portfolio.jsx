import { CheckCircle, Briefcase, TrendingUp, Building2 } from "lucide-react";

export default function Portfolio() {
    const projects = [
        {
            title: "GreenWave Ventures",
            subtitle: "Sustainable Energy Investment",
            description: "Invested in a clean-energy startup focusing on solar grids across rural Asia.",
            value: "$1.2M Invested",
            date: "Jan 2024",
        },
        {
            title: "BlockTradeX",
            subtitle: "AI-based Crypto Arbitrage",
            description: "High-frequency trading system driven by AI market analysis and real-time insights.",
            value: "$3.5M Invested",
            date: "Apr 2024",
        },
        {
            title: "AgroLift Fund",
            subtitle: "Smart Farming Tech",
            description: "Funding precision-agriculture drones and smart irrigation systems.",
            value: "$980K Invested",
            date: "Feb 2024",
        },
    ];

    const highlights = [
        { title: "Avg Monthly ROI", value: "8.6%", note: "Across all investment packages" },
        { title: "Fastest Growing Sector", value: "AI Trading", note: "142% YoY growth" },
        { title: "Total Users", value: "1.2M+", note: "Global Investors" },
        { title: "Withdrawals Processed", value: "$9.3M+", note: "In last 6 months" },
    ];
    return (
        <section className="min-h-[80vh] bg-[#F1F5F9] flex items-center overflow-hidden py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A]">
                        Our <span className="bg-gradient-to-r from-[#2563EB] to-[#10B981] bg-clip-text text-transparent">Portfolio</span>
                    </h2>
                    <p className="text-[#475569] text-lg max-w-2xl mx-auto font-medium">
                        See how Let's Grow is empowering innovation through intelligent investments in real-world businesses and technologies.
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {projects.map((project, idx) => (
                        <div
                            key={idx}
                            className="group bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-[0_4px_16px_rgba(15,23,42,0.08)] shadow-[0_2px_8px_rgba(15,23,42,0.04)] rounded-2xl p-6 transition duration-300 hover:-translate-y-2"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-[#2563EB] font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">{project.date}</div>
                                <CheckCircle className="h-5 w-5 text-[#10B981]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0F172A] mb-1">{project.title}</h3>
                            <p className="text-[#2563EB] font-bold mb-3">{project.subtitle}</p>
                            <p className="text-[#475569] text-sm mb-6 font-medium leading-relaxed">{project.description}</p>
                            <div className="text-lg font-bold text-[#10B981] bg-[#ECFDF5] px-4 py-2 rounded-xl inline-block">{project.value}</div>
                        </div>
                    ))}
                </div>

                {/* Impact Stats */}
                <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center bg-white rounded-3xl p-10 border border-[#E2E8F0] shadow-xl shadow-blue-900/5">
                    <div>
                        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="text-[#2563EB] h-8 w-8" />
                        </div>
                        <h4 className="text-3xl font-bold text-[#0F172A] mb-1">$7.2M+</h4>
                        <p className="text-[#475569] text-sm font-medium">Total Capital Deployed</p>
                    </div>
                    <div>
                        <div className="bg-[#ECFDF5] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="text-[#10B981] h-8 w-8" />
                        </div>
                        <h4 className="text-3xl font-bold text-[#0F172A] mb-1">20+</h4>
                        <p className="text-[#475569] text-sm font-medium">Projects Funded</p>
                    </div>
                    <div>
                        <div className="bg-[#FFFBEB] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Building2 className="text-[#F59E0B] h-8 w-8" />
                        </div>
                        <h4 className="text-3xl font-bold text-[#0F172A] mb-1">8</h4>
                        <p className="text-[#475569] text-sm font-medium">Industries Touched</p>
                    </div>
                    <div>
                        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="text-[#2563EB] h-8 w-8" />
                        </div>
                        <h4 className="text-3xl font-bold text-[#0F172A] mb-1">92%</h4>
                        <p className="text-[#475569] text-sm font-medium">Success Rate</p>
                    </div>
                </div>
            </div>
        </section>

    )
}
