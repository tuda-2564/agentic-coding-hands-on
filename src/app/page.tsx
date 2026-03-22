import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import KeyVisual from "@/components/home/key-visual";
import HeroSection from "@/components/home/hero-section";
import CampaignInfo from "@/components/home/campaign-info";
import AwardsGrid from "@/components/home/awards-grid";
import KudosSection from "@/components/home/kudos-section";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { getActiveCampaign } from "@/services/campaign";
import { getAwardCategories } from "@/services/awards";
import { getRecentKudos } from "@/services/kudos";

const NAV_LINKS = [
  { label: "About SAA 2025", href: "/" },
  { label: "Award Information", href: "/awards" },
  { label: "Sun* Kudos", href: "/kudos" },
];

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [campaign, categories, kudos] = await Promise.all([
    getActiveCampaign(),
    getAwardCategories(),
    getRecentKudos(20),
  ]);

  return (
    <main className="relative min-h-screen bg-navy overflow-hidden">
      <KeyVisual />
      <Header
        variant="app"
        navLinks={NAV_LINKS}
        activeHref="/"
        user={{
          name: user.user_metadata?.full_name || user.email || "User",
          avatar_url: user.user_metadata?.avatar_url,
        }}
      />
      <div className="relative pt-16">
        <HeroSection campaign={campaign} />
        {campaign && (
          <ScrollReveal>
            <CampaignInfo campaign={campaign} />
          </ScrollReveal>
        )}
        <ScrollReveal>
          <AwardsGrid categories={categories} />
        </ScrollReveal>
        <ScrollReveal>
          <KudosSection initialKudos={kudos} />
        </ScrollReveal>
      </div>
      <Footer variant="saa" activeHref="/" />
    </main>
  );
}
