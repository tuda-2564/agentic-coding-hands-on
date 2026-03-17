import Image from "next/image";
import { Suspense } from "react";
import LoginButton from "@/components/login/login-button";

type HeroSectionProps = {
  initialError?: string | null;
};

export default function HeroSection({ initialError }: HeroSectionProps) {
  return (
    <section className="absolute top-[88px] w-full px-4 md:px-12 lg:px-36 py-16 md:py-20 lg:py-24">
      <div className="flex flex-col gap-10 md:gap-16 lg:gap-30 items-start w-full lg:w-[1152px]">
        {/* B.1 Key Visual — ROOT FURTHER logo */}
        <Image
          src="/images/root-further.png"
          alt="Root Further"
          width={451}
          height={200}
          className="w-full max-w-[280px] h-auto md:w-[320px] lg:w-[451px] lg:h-[200px] object-contain"
          priority
        />

        {/* B.2 + B.3 — Description + Login button */}
        <div className="pl-4 flex flex-col gap-6">
          <p className="font-bold text-base md:text-xl leading-7 md:leading-10 tracking-[0.5px] text-white w-full max-w-[480px]">
            Bắt đầu hành trình của bạn cùng SAA 2025.{" "}
            <br className="hidden md:block" />
            Đăng nhập để khám phá!
          </p>
          <Suspense fallback={null}>
            <LoginButton initialError={initialError} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
