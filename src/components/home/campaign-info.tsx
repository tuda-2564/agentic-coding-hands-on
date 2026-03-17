import type { Campaign } from "@/types/campaign";

type CampaignInfoProps = {
  campaign: Campaign;
};

export default function CampaignInfo({ campaign }: CampaignInfoProps) {
  if (!campaign.description) return null;

  return (
    <section className="max-w-[800px] mx-auto px-6 py-12">
      <p className="text-base font-normal text-white leading-6">
        {campaign.description}
      </p>
    </section>
  );
}
