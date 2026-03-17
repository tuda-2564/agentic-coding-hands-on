import Image from "next/image";
import Link from "next/link";

type FooterProps = {
  variant?: "login" | "app" | "saa";
  activeHref?: string;
};

const SAA_NAV_LINKS = [
  { label: "About SAA 2025", href: "/" },
  { label: "Award Information", href: "/awards" },
  { label: "Sun* Kudos", href: "/#kudos-heading" },
  { label: "Tiêu chuẩn chung", href: "/standards" },
];

export default function Footer({
  variant = "login",
  activeHref,
}: FooterProps) {
  if (variant === "saa") {
    return (
      <footer className="w-full border-t border-[#2E3940] px-4 md:px-12 lg:px-[90px] py-10">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
            <Image
              src="/images/saa-logo-footer.png"
              alt="SAA 2025"
              width={69}
              height={64}
              className="hidden lg:block"
            />
            <nav
              aria-label="Footer navigation"
              className="flex flex-wrap justify-center gap-6 lg:gap-12"
            >
              {SAA_NAV_LINKS.map((link) => {
                const isActive = activeHref === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-bold text-base leading-6 transition-colors duration-200 min-h-[44px] flex items-center px-2 rounded ${
                      isActive
                        ? "text-[#FFEA9E] bg-[rgba(255,234,158,0.1)] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]"
                        : "text-white hover:text-[#FFEA9E]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <p className="font-alt font-bold text-base leading-6 text-white text-center">
            Bản quyền thuộc về Sun* © 2025
          </p>
        </div>
      </footer>
    );
  }

  if (variant === "app") {
    return (
      <footer className="w-full bg-footer-bg border-t border-gold/10 px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-alt font-bold text-base leading-6 text-white">
            Bản quyền thuộc về Sun* © 2025
          </p>
          <div className="flex items-center gap-6 text-sm text-[#B0BEC5]">
            <a href="#" className="hover:text-white transition-colors">
              Điều khoản
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Chính sách
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Liên hệ
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="absolute bottom-0 w-full px-4 md:px-12 lg:px-[90px] py-10 border-t border-[#2E3940] flex justify-center lg:justify-between items-center">
      <p className="font-alt font-bold text-base leading-6 text-white text-center">
        Bản quyền thuộc về Sun* © 2025
      </p>
    </footer>
  );
}
