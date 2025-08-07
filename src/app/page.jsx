import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner"
import FeaturedCollections from "@/components/FeaturedCollections"
import EditorialLookbook from "@/components/EditorialLookbook";
import BestsellersCollection from "@/components/Bestsellers";
import AtelierExperience from "@/components/AtelierExperience";
import CompanyBanner from "@/components/CompanyBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CompanyBanner />
      <FeaturedCollections />
      <BestsellersCollection />
      {/* <EditorialLookbook /> */}
      {/* <AtelierExperience /> */}
    </>
  );
}
