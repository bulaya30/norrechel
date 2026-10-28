import HeaderWrapper from "@/components/header/Header";
import VisitorTracker from "@/features/visitors/components/VisitorTracker";
import ServicesHero from "@/features/services/components/ServicesHero";
import ServicesOverview from "@/features/services/components/ServicesOverview";
import ServicesList from "@/features/services/components/ServicesList";
import FeaturedProject from "@/features/services/components/FeaturedProject";
import WorkProcess from "@/features/services/components/WorkProcess";
import ServicesCTA from "@/features/services/components/ServicesCTA";

export default function ServicesPage() {
  return (
    <main 
        id="main"
      className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950"
    >
        <VisitorTracker/>
        
        <HeaderWrapper />
        
        <div className="relative z-10">
            <ServicesHero />
            <ServicesOverview />
            <ServicesList />
            <FeaturedProject />
            <WorkProcess />
            <ServicesCTA />

        </div>
    </main>
  );
}
