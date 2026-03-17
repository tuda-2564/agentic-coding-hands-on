import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import AwardKeyVisual from "@/components/awards/award-keyvisual";
import SectionTitle from "@/components/awards/section-title";
import AwardsSection from "@/components/awards/awards-section";
import KudosPromo from "@/components/awards/kudos-promo";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { AWARD_CATEGORIES } from "@/utils/award-data";

const NAV_LINKS = [
  { label: "About SAA 2025", href: "/" },
  { label: "Award Information", href: "/awards" },
  { label: "Sun* Kudos", href: "/#kudos-heading" },
];

export default async function AwardsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="relative min-h-screen bg-navy overflow-hidden">
      <AwardKeyVisual />
      <Header
        variant="app"
        navLinks={NAV_LINKS}
        activeHref="/awards"
        user={{
          name: user.user_metadata?.full_name || user.email || "User",
          avatar_url: user.user_metadata?.avatar_url,
        }}
      />
      <div className="relative">
        <SectionTitle />
        <ScrollReveal>
          <AwardsSection categories={AWARD_CATEGORIES} />
        </ScrollReveal>
        <ScrollReveal>
          <KudosPromo />
        </ScrollReveal>
      </div>
      <Footer variant="saa" activeHref="/awards" />
    </main>
  );
}
