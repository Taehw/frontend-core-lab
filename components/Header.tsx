"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { isAuthenticated, isAdmin } from "@/lib/auth";
import NotificationBell from "@/components/NotificationBell";

export default function Header() {
  const pathname = usePathname();
  const { logout, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAuthenticated(isAuthenticated());
  }, [pathname]);

  const admin = isAdmin();

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isOAuthPage = pathname.startsWith("/oauth2");

  if (isAuthPage || isOAuthPage) {
    return null;
  }

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link
            href="/"
            className="font-semibold text-zinc-900 hover:text-zinc-700"
          >
            Core Lab
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link
          href="/posts"
          className="font-semibold text-zinc-900 hover:text-zinc-700"
        >
          Core Lab
        </Link>
        <nav className="flex items-center gap-1">
          {authenticated ? (
            <>
              <Link
                href="/posts"
                className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                게시판
              </Link>
              <Link
                href="/posts/new"
                className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                글쓰기
              </Link>
              {admin && (
                <Link
                  href="/admin"
                  className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-50 hover:text-amber-700"
                >
                  관리자
                </Link>
              )}
              <NotificationBell />
              <button
                onClick={logout}
                disabled={isLoading}
                className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-50"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
