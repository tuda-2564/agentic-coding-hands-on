import Image from "next/image";
import LanguageSelector from "@/components/header/language-selector";
import HeaderClient from "@/components/header/header-client";
import type { Language } from "@/types/auth";

const DEFAULT_LANGUAGES: Language[] = [
  { code: "VN", label: "Vietnamese", flag: "/icons/flag-vn.svg" },
  { code: "EN", label: "English", flag: "/icons/flag-en.svg" },
];

type NavLink = {
  label: string;
  href: string;
};

type HeaderProps = {
  variant?: "login" | "app";
  languages?: Language[];
  navLinks?: NavLink[];
  activeHref?: string;
  user?: {
    name: string;
    avatar_url?: string;
  } | null;
};

export default function Header({
  variant = "login",
  languages = DEFAULT_LANGUAGES,
  navLinks,
  activeHref,
  user,
}: HeaderProps) {
  if (variant === "app") {
    return (
      <HeaderClient
        languages={languages}
        navLinks={navLinks ?? []}
        activeHref={activeHref}
        user={user ?? null}
      />
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 w-full h-16 px-6 bg-navy/95 backdrop-blur-sm border-b border-gold/10 flex flex-row justify-between items-center z-50">
      <Image
        src="/images/saa-logo.png"
        alt="SAA 2025"
        width={52}
        height={56}
        priority
      />
      <LanguageSelector languages={languages} />
    </header>
  );
}
