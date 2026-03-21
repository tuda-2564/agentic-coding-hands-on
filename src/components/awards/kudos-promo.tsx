import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/ui/icon";

export default function KudosPromo() {
  return (
    <section className="px-4 md:px-12 lg:px-36 py-16 lg:py-24">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
        {/* Left content column */}
        <div className="flex flex-col gap-6 max-w-xl">
          <p className="text-white font-bold text-lg lg:text-2xl leading-8">
            Phong trào ghi nhận
          </p>
          <h2 className="text-kudos-gold font-bold text-3xl md:text-4xl lg:text-[57px] lg:leading-tight">
            Sun* Kudos
          </h2>
          <p className="text-white font-bold text-sm lg:text-base leading-6 tracking-[0.5px]">
            ĐIỂM MỚI CỦA SAA 2025 Hoạt động ghi nhận và cảm ơn đồng nghiệp -
            lần đầu tiên được diễn ra dành cho tất cả Sunner. Hoạt động sẽ được
            triển khai vào tháng 11/2025, khuyến khích người Sun* chia sẻ những
            lời ghi nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây
            sẽ là chất liệu để Hội đồng Heads tham khảo trong quá trình lựa
            chọn người đạt giải.
          </p>
          <Link
            href="/kudos"
            className="inline-flex items-center gap-1 bg-kudos-gold text-navy font-bold text-base leading-6 px-4 py-4 rounded w-fit hover:opacity-90 transition-opacity duration-150 focus-visible:outline-2 focus-visible:outline-kudos-gold focus-visible:outline-offset-2 min-h-11"
          >
            Chi tiết
            <Icon name="external-link" size={24} />
          </Link>
        </div>

        {/* Right branding: Sun* logo mark + decorative KUDOS text */}
        <div className="hidden lg:flex flex-col items-center gap-4 shrink-0">
          <Image
            src="/images/saa-logo.png"
            alt="Sun* Kudos"
            width={80}
            height={74}
            className="object-contain"
          />
          <div className="text-[#DBD1C1] font-bold text-6xl xl:text-[96px] leading-none tracking-[-0.13em] select-none">
            KUDOS
          </div>
        </div>
      </div>
    </section>
  );
}
