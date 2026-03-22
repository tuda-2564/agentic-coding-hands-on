import Image from "next/image";
import type { ReactNode } from "react";

type AwardKeyVisualProps = {
  children?: ReactNode;
};

export default function AwardKeyVisual({ children }: AwardKeyVisualProps) {
  return (
    <div className="relative w-full h-75 md:h-112.5 lg:h-156.75">
      <Image
        src="/images/keyvisual-awards.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      {/* ROOT FURTHER logo overlay (Figma node 2789:12915) */}
      <div className="absolute top-12 md:top-16 lg:top-20 left-4 md:left-12 lg:left-36 z-10 pointer-events-none">
        <Image
          src="/images/root-further.png"
          alt="Root Further"
          width={338}
          height={150}
          className="w-40 md:w-56 lg:w-84.5 h-auto opacity-90"
        />
      </div>
      {/* Gradient overlay — fades to dark background at the bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(0deg, #00101A -4.23%, rgba(0, 19, 32, 0) 52.79%)",
        }}
        aria-hidden="true"
      />
      {/* Section Title overlay — bottom-left of Bìa frame (Figma node 313:8453) */}
      {children && (
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-12 lg:px-36 pb-10 lg:pb-16 z-10">
          {children}
        </div>
      )}
    </div>
  );
}
