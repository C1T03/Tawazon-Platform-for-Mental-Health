import React from "react";
import WelcomeHero from "./components/WelcomeHero";
import PlatformStats from "./components/PlatformStats";
import UserTestimonials from "./components/UserTestimonials";
import TherapistsInvitation from "./components/TherapistsInvitation";
import PlatformGuide from "./components/PlatformGuide";
import CommonQuestions  from "./components/CommonQuestions";
import ComparisonSection from "./components/ComparisonSection";
import BenefitsSection from "./components/BenefitsSection";
import PsychologicalSupport from "./components/PsychologicalSupport";
import ResourceGuide from "./components/ResourceGuide";
import Footer from "./components/Footer";
export default function Home() {
  return (
    <>
      <WelcomeHero />
      <PsychologicalSupport />
      <PlatformStats />

      <TherapistsInvitation />
                  <ResourceGuide />

      <PlatformGuide />
      <UserTestimonials />
      <ComparisonSection />
      <BenefitsSection />
      <CommonQuestions  />
      <Footer />
    </>
  );
}
