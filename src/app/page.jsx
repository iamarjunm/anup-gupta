import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner"
import FeaturedCollections from "@/components/FeaturedCollections"
import EditorialLookbook from "@/components/EditorialLookbook";
import BestsellersCollection from "@/components/Bestsellers";
import AtelierExperience from "@/components/AtelierExperience";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <EditorialLookbook />
      <AtelierExperience />
      <BestsellersCollection />
    </>
  );
}
