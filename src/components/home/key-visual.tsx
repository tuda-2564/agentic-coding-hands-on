import Image from "next/image";

export default function KeyVisual() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Image
        src="/images/hero-bg.svg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <Image
        src="/images/keyvisual-bg.svg"
        alt=""
        fill
        className="object-cover mix-blend-screen opacity-60"
      />
    </div>
  );
}
