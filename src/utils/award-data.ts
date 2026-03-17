import type { AwardDetailCategory } from "@/types/awards";

export const AWARD_CATEGORIES: AwardDetailCategory[] = [
  {
    id: "top-talent",
    name: "Top Talent",
    description:
      "Giải thưởng vinh danh những cá nhân xuất sắc nhất, có đóng góp nổi bật trong năm. Top Talent là những người thể hiện năng lực vượt trội, tinh thần cống hiến và tạo ra giá trị đặc biệt cho tổ chức thông qua chuyên môn, sáng tạo và tinh thần hợp tác.",
    imageUrl: "/images/awards/top-talent.svg",
    quantity: 10,
    unitType: "Cá nhân",
    prizeTiers: [{ label: "cho mỗi giải thưởng", value: "7.000.000 VNĐ" }],
  },
  {
    id: "top-project",
    name: "Top Project",
    description:
      "Giải thưởng dành cho những dự án xuất sắc nhất trong năm, ghi nhận sự nỗ lực và thành tựu của cả tập thể. Top Project vinh danh các dự án có tác động lớn, mang lại giá trị cao cho khách hàng và tổ chức.",
    imageUrl: "/images/awards/best-project.svg",
    quantity: 2,
    unitType: "Tập thể",
    prizeTiers: [{ label: "cho mỗi giải thưởng", value: "15.000.000 VNĐ" }],
  },
  {
    id: "top-project-leader",
    name: "Top Project Leader",
    description:
      "Giải thưởng vinh danh những người dẫn dắt dự án xuất sắc nhất, thể hiện khả năng lãnh đạo, quản lý và truyền cảm hứng cho đội nhóm. Top Project Leader là những cá nhân có tầm nhìn chiến lược và khả năng hiện thực hóa mục tiêu.",
    imageUrl: "/images/awards/culture-champion.svg",
    quantity: 3,
    unitType: "Cá nhân",
    prizeTiers: [{ label: "cho mỗi giải thưởng", value: "7.000.000 VNĐ" }],
  },
  {
    id: "best-manager",
    name: "Best Manager",
    description:
      "Giải thưởng ghi nhận nhà quản lý xuất sắc nhất, người có khả năng xây dựng đội ngũ mạnh, phát triển nhân tài và tạo môi trường làm việc tích cực. Best Manager thể hiện sự tận tâm trong việc đồng hành và phát triển con người.",
    imageUrl: "/images/awards/best-manager.svg",
    quantity: 1,
    unitType: "Cá nhân",
    prizeTiers: [{ label: "", value: "10.000.000 VNĐ" }],
  },
  {
    id: "signature-2025",
    name: "Signature 2025 - Creator",
    description:
      "Giải thưởng đặc biệt của năm 2025, vinh danh những cá nhân và tập thể có đóng góp sáng tạo đột phá, mang lại giá trị mới mẻ và khác biệt cho tổ chức. Signature 2025 - Creator tôn vinh tinh thần đổi mới và khả năng kiến tạo.",
    imageUrl: "/images/awards/innovation.svg",
    quantity: 1,
    unitType: "Cá nhân + Tập thể",
    prizeTiers: [
      { label: "cho giải cá nhân", value: "5.000.000 VNĐ" },
      { label: "cho giải tập thể", value: "8.000.000 VNĐ" },
    ],
  },
  {
    id: "mvp",
    name: "MVP (Most Valuable Person)",
    description:
      "Giải thưởng cao quý nhất của SAA 2025, vinh danh cá nhân có giá trị nhất — người tạo ra ảnh hưởng sâu rộng và đóng góp đặc biệt xuất sắc cho sự phát triển của Sun*. MVP là biểu tượng của sự cống hiến, tài năng và tinh thần Sun*.",
    imageUrl: "/images/awards/mvp.svg",
    quantity: 1,
    unitType: "Cá nhân",
    prizeTiers: [{ label: "", value: "15.000.000 VNĐ" }],
  },
];
