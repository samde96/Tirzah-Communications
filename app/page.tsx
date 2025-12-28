import CallToAction from "@/components/call-to-action";
import ContentSection from "@/components/content-3";
import Features from "@/components/features-1";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import IntegrationsSection from "@/components/integrations-3";
import TeamSection from "@/components/team";
import Testimonials from "@/components/testimonials";

const Homepage = () => {
  return (
    <div>
     <HeroSection />
     <Features />
     <IntegrationsSection />
     <ContentSection />
     {/* <TeamSection /> */}
     <Testimonials />
     {/* <CallToAction /> */}
     <FooterSection />
    </div>
  );
}

export default Homepage;