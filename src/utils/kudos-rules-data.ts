import type { HeroBadgeTier, CollectibleIcon } from "@/types/kudos-rules";

export const HERO_BADGE_TIERS: HeroBadgeTier[] = [
  {
    id: "new-hero",
    label: "New Hero",
    imageSrc: "/images/kudos/new-hero-badge.png",
    condition: "Có 1-4 người gửi Kudos cho bạn",
    description:
      "Hành trình lan tỏa điều tốt đẹp bắt đầu – những lời cảm ơn và ghi nhận đầu tiên đã tìm đến bạn.",
  },
  {
    id: "rising-hero",
    label: "Rising Hero",
    imageSrc: "/images/kudos/rising-hero-badge.png",
    condition: "Có 5-9 người gửi Kudos cho bạn",
    description:
      "Hình ảnh bạn đang lớn dần trong trái tim đồng đội bằng sự tử tế và cống hiến của mình.",
  },
  {
    id: "super-hero",
    label: "Super Hero",
    imageSrc: "/images/kudos/super-hero-badge.png",
    condition: "Có 10–20 người gửi Kudos cho bạn",
    description:
      "Bạn đã trở thành biểu tượng được tin tưởng và yêu quý, người luôn sẵn sàng hỗ trợ và được nhiều đồng đội nhớ đến.",
  },
  {
    id: "legend-hero",
    label: "Legend Hero",
    imageSrc: "/images/kudos/legend-hero-badge.png",
    condition: "Có hơn 20 người gửi Kudos cho bạn",
    description:
      "Bạn đã trở thành huyền thoại – người để lại dấu ấn khó quên trong tập thể bằng trái tim và hành động của mình.",
  },
];

export const COLLECTIBLE_ICONS: CollectibleIcon[] = [
  {
    id: "revival",
    label: "REVIVAL",
    imageSrc: "/images/kudos/icons/revival.png",
    alt: "Revival icon",
  },
  {
    id: "touch-of-light",
    label: "TOUCH OF LIGHT",
    imageSrc: "/images/kudos/icons/touch-of-light.png",
    alt: "Touch of Light icon",
  },
  {
    id: "stay-gold",
    label: "STAY GOLD",
    imageSrc: "/images/kudos/icons/stay-gold.png",
    alt: "Stay Gold icon",
  },
  {
    id: "flow-to-horizon",
    label: "FLOW TO HORIZON",
    imageSrc: "/images/kudos/icons/flow-to-horizon.png",
    alt: "Flow to Horizon icon",
  },
  {
    id: "beyond-the-boundary",
    label: "BEYOND THE BOUNDARY",
    imageSrc: "/images/kudos/icons/beyond-the-boundary.png",
    alt: "Beyond the Boundary icon",
  },
  {
    id: "root-further",
    label: "ROOT FURTHER",
    imageSrc: "/images/kudos/icons/root-further.png",
    alt: "Root Further icon",
  },
];

export const SECTION_1_HEADING =
  "NGƯỜI NHẬN KUDOS: HUY HIỆU HERO CHO NHỮNG ẢNH HƯỞNG TÍCH CỰC";

export const SECTION_1_BODY =
  "Dựa trên số lượng đồng đội gửi trao Kudos, bạn sẽ sở hữu Huy hiệu Hero tương ứng, được hiển thị trực tiếp cạnh tên profile";

export const SECTION_2_HEADING =
  "NGƯỜI GỬI KUDOS: SƯU TẬP TRỌN BỘ 6 ICON, NHẬN NGAY PHẦN QUÀ BÍ ẨN";

export const SECTION_2_BODY =
  "Mỗi lời Kudos bạn gửi sẽ được đăng tải trên hệ thống và nhận về những lượt ❤️ từ cộng đồng Sunner. Cứ mỗi 5 lượt ❤️, bạn sẽ được mở 1 Secret Box, với cơ hội nhận về một trong 6 icon độc quyền của SAA.";

export const COLLECTION_NOTE =
  "Những Sunner thu thập trọn bộ 6 icon sẽ nhận về một phần quà bí ẩn từ SAA 2025.";

export const SECTION_3_HEADING = "KUDOS QUỐC DÂN";

export const SECTION_3_BODY =
  "5 Kudos nhận về nhiều ❤️ nhất toàn Sun* sẽ chính thức trở thành Kudos Quốc Dân và được trao phần quà đặc biệt từ SAA 2025: Root Further.";
