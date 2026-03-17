import DigitCard from "@/components/countdown/digit-card";

type CountdownUnitProps = {
  value: number;
  label: string;
};

export default function CountdownUnit({ value, label }: CountdownUnitProps) {
  const [tens, ones] = String(value).padStart(2, "0").split("");

  return (
    <div className="flex flex-col items-center gap-3 lg:gap-[21px] w-auto lg:w-[175px]">
      <div className="flex flex-row items-center gap-3 lg:gap-[21px]">
        <DigitCard digit={tens} />
        <DigitCard digit={ones} />
      </div>
      <span className="font-bold text-base leading-6 md:text-2xl lg:text-4xl lg:leading-[48px] text-white uppercase">
        {label}
      </span>
    </div>
  );
}
