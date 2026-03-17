"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/libs/supabase/client";
import Spinner from "@/components/login/spinner";
import ErrorMessage from "@/components/login/error-message";

const ERROR_MESSAGES: Record<string, string> = {
  auth_error: "Đăng nhập thất bại. Vui lòng thử lại.",
  access_denied: "Bạn đã từ chối cấp quyền. Vui lòng thử lại.",
  timeout: "Quá thời gian chờ. Vui lòng thử lại.",
};

function getErrorMessage(code: string | null): string | null {
  if (!code) return null;
  return ERROR_MESSAGES[code] ?? "Đã xảy ra lỗi. Vui lòng thử lại.";
}

type LoginButtonProps = {
  initialError?: string | null;
};

export default function LoginButton({ initialError }: LoginButtonProps) {
  const searchParams = useSearchParams();
  const errorCode = initialError ?? searchParams.get("error");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(getErrorMessage(errorCode));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleLogin() {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    // 30-second timeout guard
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setError(getErrorMessage("timeout"));
    }, 30_000);

    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={handleLogin}
        disabled={isLoading}
        aria-busy={isLoading}
        aria-disabled={isLoading}
        aria-label="Login with Google"
        className="flex flex-row items-center gap-2 bg-[#FFEA9E] rounded-lg py-4 px-6 w-full md:w-[305px] h-[60px] cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 focus:outline-2 focus:outline-offset-2 focus:outline-[#FFEA9E] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
      >
        <span className="font-bold text-[22px] leading-7 text-[#00101A] whitespace-nowrap">
          LOGIN With Google
        </span>
        {isLoading ? (
          <Spinner />
        ) : (
          <Image
            src="/icons/google.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
          />
        )}
      </button>
      <ErrorMessage message={isLoading ? null : (getErrorMessage(errorCode) ?? error)} />
    </div>
  );
}
