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
import PrelaunchCountdown from "@/components/countdown/prelaunch-countdown";
import { getActiveCampaign } from "@/services/campaign";
import { getAwardCategories } from "@/services/awards";
import { getRecentKudos } from "@/services/kudos";

const NAV_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Giải thưởng", href: "#awards-heading" },
  { label: "Kudos", href: "#kudos-heading" },
];

export default async function HomePage() {
  // 1. Fetch campaign first (no auth needed — accessible to all visitors)
  let campaign;
  try {
    campaign = await getActiveCampaign();
  } catch {
    campaign = null;
  }

  // 2. If event hasn't started → show prelaunch countdown (public, no auth check)
  if (
    campaign?.event_date &&
    new Date(campaign.event_date) > new Date()
  ) {
    return <PrelaunchCountdown eventDate={campaign.event_date} />;
  }

  // 3. Event has started or no campaign → require auth for homepage
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [categories, kudos] = await Promise.all([
    getAwardCategories(),
    getRecentKudos(),
  ]);

  return (
    <main className="relative min-h-screen bg-navy overflow-hidden">
      <KeyVisual />
      <Header
        variant="app"
        navLinks={NAV_LINKS}
        user={{
          name: user.user_metadata?.full_name || user.email || "User",
          avatar_url: user.user_metadata?.avatar_url,
        }}
      />
      <div className="relative pt-16 max-w-378 mx-auto">
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
      <Footer variant="app" />
    </main>
  );
}
