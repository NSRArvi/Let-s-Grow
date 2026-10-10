import HeroSection from "../components/home/HeroSection";
import LeaderboardSection from "../components/home/LeaderboardSection";
import ReviewsSection from "../components/home/ReviewsSection";
import TopAssetsSection from "../components/home/TopAssetsSection";
import WhyUs from "../components/home/WhyUs";

export const metadata = {
  title: "Home - Smart Business & Asset Investments",
  description: "Discover curated business packages, earn daily ROI, and grow your wealth with Let's Grow — the trusted, transparent investment platform.",
};

export default function Home() {
  return (
      <main>
        <HeroSection/>
        <WhyUs/>
        <TopAssetsSection/>
        <LeaderboardSection/>
        <ReviewsSection/>
      </main>
  );
}
