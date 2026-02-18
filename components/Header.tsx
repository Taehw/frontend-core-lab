"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { isAuthenticated } from "@/lib/auth";

export default function Header() {
  const pathname = usePathname();
  const { logout, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAuthenticated(isAuthenticated());
  }, [pathname]); // pathname 변경 시(로그인/로그아웃 후) 재확인

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isOAuthPage = pathname.startsWith("/oauth2");

  if (isAuthPage || isOAuthPage) {
    return null;
  }

  if (!mounted) {
    return (
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="font-semibold text-zinc-900">
            Core Lab
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link href="/posts" className="font-semibold text-zinc-900">
          Core Lab
        </Link>
        <nav className="flex items-center gap-4">
          {authenticated ? (
            <>
              <Link
                href="/posts"
                className="text-sm text-zinc-600 hover:text-zinc-900"
              >
                게시판
              </Link>
              <Link
                href="/posts/new"
                className="text-sm text-zinc-600 hover:text-zinc-900"
              >
                글쓰기
              </Link>
              <button
                onClick={logout}
                disabled={isLoading}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 disabled:opacity-50"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
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
