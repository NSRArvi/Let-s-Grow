import PerformanceHeroSection from "./PerformanceHeroSection";
import ReviewsSection from "../../components/home/ReviewsSection";
import Portfolio from "./Portfolio";

export const metadata = {
  title: "Investment Portfolio & Live Performance",
  description: "Explore our active investments, capital deployment, verified performance metrics, and real-world business results across multiple industries.",
};

export default function PortfolioPage() {
    return (
        <section className="text-white">
            <PerformanceHeroSection />
            <Portfolio />
            <ReviewsSection />
        </section>
    );
}
