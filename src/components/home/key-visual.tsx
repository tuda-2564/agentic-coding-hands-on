import Image from "next/image";

export default function KeyVisual() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {/* Hero artwork background */}
      <div className="absolute inset-x-0 top-0 h-[300px] md:h-[450px] lg:h-[627px]">
        <Image
          src="/images/keyvisual-awards.png"
          alt=""
          fill
          priority
          className="object-cover"
        />
        {/* Gradient overlay — fades artwork to dark background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, #00101A -4.23%, rgba(0, 19, 32, 0) 52.79%)",
          }}
        />
      </div>
    </div>
  );
}
