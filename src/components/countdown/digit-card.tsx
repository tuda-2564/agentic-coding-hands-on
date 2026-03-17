type DigitCardProps = {
  digit: string;
};

export default function DigitCard({ digit }: DigitCardProps) {
  return (
    <div
      className="w-12 h-[77px] md:w-[60px] md:h-[96px] lg:w-[77px] lg:h-[123px] rounded-xl flex items-center justify-center backdrop-blur-[25px] border-[0.75px] border-[rgba(255,234,158,0.5)]"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.05) 100%)",
      }}
    >
      <span className="font-digital text-[46px] md:text-[57px] lg:text-[73.73px] text-white">
        {digit}
      </span>
    </div>
  );
}
