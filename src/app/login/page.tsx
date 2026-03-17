import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/libs/supabase/server";
import Header from "@/components/header/header";
import HeroSection from "@/components/login/hero-section";
import Footer from "@/components/footer/footer";

type SearchParams = Promise<{ error?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const { error } = await searchParams;

  return (
    <main className="relative min-h-screen bg-[#00101A] overflow-hidden">
      {/* C_Keyvisual — full-bleed background artwork */}
      <Image
        src="/images/keyvisual-bg.svg"
        alt=""
        fill
        className="object-cover object-center"
        style={{ zIndex: 0 }}
        priority
        aria-hidden="true"
      />
      {/* Left horizontal gradient overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, #00101A 0%, #00101A 25.41%, rgba(0,16,26,0) 100%)",
        }}
        aria-hidden="true"
      />
      {/* Bottom vertical gradient overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[1] pointer-events-none"
        style={{
          top: "138px",
          background:
            "linear-gradient(0deg, #00101A 22.48%, rgba(0,19,32,0) 51.74%)",
        }}
        aria-hidden="true"
      />

      <Header />
      <HeroSection initialError={error} />
      <Footer />
    </main>
  );
}
