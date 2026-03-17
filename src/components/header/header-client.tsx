"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LanguageSelector from "@/components/header/language-selector";
import ProfileDropdown from "@/components/header/profile-dropdown";
import MobileMenu from "@/components/header/mobile-menu";
import type { Language } from "@/types/auth";

type NavLink = {
  label: string;
  href: string;
};

type HeaderClientProps = {
  languages: Language[];
  navLinks: NavLink[];
  activeHref?: string;
  user: {
    name: string;
    avatar_url?: string;
  } | null;
};

export default function HeaderClient({
  languages,
  navLinks,
  activeHref,
  user,
}: HeaderClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<
    "profile" | "language" | null
  >(null);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProfileToggle = useCallback(() => {
    setActiveDropdown((prev) => (prev === "profile" ? null : "profile"));
  }, []);

  const handleLanguageToggle = useCallback(() => {
    setActiveDropdown((prev) => (prev === "language" ? null : "language"));
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full h-16 px-6 flex items-center justify-between z-50 backdrop-blur-sm transition-all duration-150 ${
        isScrolled
          ? "bg-navy shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          : "bg-navy/95 border-b border-gold/10"
      }`}
      role="banner"
    >
      <div className="flex items-center gap-8">
        <Link href="/" aria-label="Go to homepage">
          <Image
            src="/images/saa-logo.png"
            alt="SAA 2025"
            width={40}
            height={44}
            priority
          />
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-6"
        >
          {navLinks.map((link) => {
            const isActive = activeHref === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "text-gold border-b border-gold"
                    : "text-white/80 hover:text-gold hover:opacity-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSelector
          languages={languages}
          isOpen={activeDropdown === "language"}
          onToggle={handleLanguageToggle}
        />

        {user && (
          <ProfileDropdown
            user={user}
            isOpen={activeDropdown === "profile"}
            onToggle={handleProfileToggle}
          />
        )}

        <MobileMenu navLinks={navLinks} />
      </div>
    </header>
  );
}
