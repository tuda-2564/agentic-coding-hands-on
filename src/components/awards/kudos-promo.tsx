import Link from "next/link";
import Icon from "@/components/ui/icon";

export default function KudosPromo() {
  return (
    <section className="px-4 md:px-12 lg:px-36 py-16 lg:py-24">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
        <div className="flex flex-col gap-6 max-w-xl">
          <p className="text-white font-bold text-lg lg:text-2xl leading-8">
            Phong trào ghi nhận
          </p>
          <h2 className="text-[#FFEA9E] font-bold text-3xl md:text-4xl lg:text-[57px] lg:leading-tight">
            Sun* Kudos
          </h2>
          <p className="text-white font-bold text-sm lg:text-base leading-6 tracking-[0.5px]">
            Sun* Kudos là phong trào ghi nhận và tôn vinh những đóng góp tích
            cực của đồng nghiệp trong công việc hàng ngày. Hãy gửi lời cảm ơn
            và ghi nhận đến những người xung quanh bạn.
          </p>
          <Link
            href="/#kudos-heading"
            className="inline-flex items-center gap-1 bg-[#FFEA9E] text-[#00101A] font-bold text-base leading-6 px-4 py-4 rounded w-fit hover:opacity-90 transition-opacity duration-150 focus-visible:outline-2 focus-visible:outline-[#FFEA9E] focus-visible:outline-offset-2 min-h-[44px]"
          >
            Chi tiết
            <Icon name="arrow-right" size={24} />
          </Link>
        </div>

        <div className="hidden lg:block text-[#DBD1C1] font-bold text-6xl xl:text-[96px] leading-none tracking-[-0.13em] select-none">
          KUDOS
        </div>
      </div>
    </section>
  );
}
