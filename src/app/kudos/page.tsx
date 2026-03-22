import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import KudosKeyvisual from "@/components/kudos-board/kudos-keyvisual";
import ActionBarWrapper from "@/components/kudos-board/action-bar-wrapper";
import KudosRulesWrapper from "@/components/kudos/kudos-rules-wrapper";
import HighlightSection from "@/components/kudos-board/highlight-section";
import SpotlightSection from "@/components/kudos-board/spotlight-section";
import AllKudosSection from "@/components/kudos-board/all-kudos-section";
import StatsCard from "@/components/kudos-board/stats-card";
import SunnerList from "@/components/kudos-board/sunner-list";
import { getHighlightKudos } from "@/services/kudos-highlight";
import { getKudosFeed } from "@/services/kudos-feed";
import { getKudoStats } from "@/services/kudos-stats";
import { getSpotlightData } from "@/services/kudos-spotlight";
import { getGiftRecipients, getSunnerRankings } from "@/services/sunners";

const NAV_LINKS = [
  { label: "About SAA 2025", href: "/" },
  { label: "Award Information", href: "/awards" },
  { label: "Sun* Kudos", href: "/kudos" },
];

export default async function KudosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [highlights, feedResult, stats, spotlight, giftRecipients, rankings] =
    await Promise.all([
      getHighlightKudos(undefined, user.id),
      getKudosFeed(undefined, 10, undefined, user.id),
      getKudoStats(user.id),
      getSpotlightData(),
      getGiftRecipients(),
      getSunnerRankings(),
    ]);

  const userMeta = user.user_metadata ?? {};

  const sidebar = (
    <>
      <StatsCard stats={stats} />
      <SunnerList
        title="10 SUNNER NHẬN QUÀ MỚI NHẤT"
        items={giftRecipients.map((g) => ({
          ...g,
          description: g.description,
        }))}
      />
      <SunnerList
        title="10 SUNNER CÓ SỰ THĂNG HẠNG MỚI NHẤT"
        items={rankings.map((r) => ({
          ...r,
          description: r.rank_change,
        }))}
      />
    </>
  );

  return (
    <main className="min-h-screen bg-navy">
      <a href="#kudos-content" className="skip-to-content">
        Skip to content
      </a>
      <Header
        variant="app"
        navLinks={NAV_LINKS}
        activeHref="/kudos"
        user={{
          name: userMeta.full_name ?? user.email ?? "",
          avatar_url: userMeta.avatar_url,
        }}
      />
      <div id="kudos-content" className="flex flex-col pb-[120px]">
        {/* Top area: keyvisual + rules + action bar (tightly spaced) */}
        <div className="flex flex-col gap-10">
          <KudosKeyvisual />
          <div className="flex justify-center">
            <KudosRulesWrapper />
          </div>
          <ActionBarWrapper />
        </div>

        {/* Main sections with 120px gaps */}
        <div className="flex flex-col gap-[120px] mt-[120px]">
          <HighlightSection initialHighlights={highlights} />
          <SpotlightSection
            total={spotlight.total}
            entries={spotlight.entries}
          />
          <AllKudosSection
            initialKudos={feedResult.kudos}
            initialCursor={feedResult.nextCursor}
            sidebar={sidebar}
          />
        </div>
      </div>
      <Footer variant="saa" activeHref="/kudos" />
    </main>
  );
}
