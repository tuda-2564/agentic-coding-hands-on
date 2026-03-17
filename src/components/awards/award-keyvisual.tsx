import Image from "next/image";

export default function AwardKeyVisual() {
  return (
    <div
      className="relative w-full h-[300px] md:h-[450px] lg:h-[627px]"
      aria-hidden="true"
    >
      <Image
        src="/images/root-further.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(0deg, #00101A -4.23%, rgba(0, 19, 32, 0) 52.79%)",
        }}
      />
    </div>
  );
}
