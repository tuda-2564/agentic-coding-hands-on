"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

type ProfileDropdownProps = {
  user: {
    name: string;
    avatar_url?: string;
  };
  isOpen: boolean;
  onToggle: () => void;
};

export default function ProfileDropdown({
  user,
  isOpen,
  onToggle,
}: ProfileDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        isOpen
      ) {
        onToggle();
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) onToggle();
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onToggle]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Profile menu for ${user.name}`}
        className="flex items-center gap-2 rounded-full p-1 transition-colors"
      >
        {user.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt={user.name}
            width={32}
            height={32}
            className="rounded-full border-2 border-transparent hover:border-gold"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm border-2 border-transparent hover:border-gold">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[#0B0F12] border border-[#2E3940] rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2E3940]">
            <p className="text-sm font-bold text-white truncate">
              {user.name}
            </p>
          </div>
          <ul role="menu">
            <li role="menuitem">
              <Link
                href="/profile"
                className="block px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                Profile
              </Link>
            </li>
            <li role="menuitem">
              <Link
                href="/settings"
                className="block px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                Settings
              </Link>
            </li>
            <li role="menuitem">
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Sign out
                </button>
              </form>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
