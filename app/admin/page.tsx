"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/axios";
import { isAuthenticated, isAdmin } from "@/lib/auth";

export default function AdminPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    setAuth(isAuthenticated());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setAuth(true);
  }, [mounted, router]);

  useEffect(() => {
    if (!auth) return;

    const fetchAdmin = async () => {
      setIsLoading(true);
      setError(null);
      setMessage(null);
      try {
        const { data } = await apiClient.get<string>("/admin");
        setMessage(data);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response
          ?.status;
        const errorData = (err as { response?: { data?: { error?: string } } })
          ?.response?.data;
        if (status === 403) {
          setError(errorData?.error || "관리자 권한이 필요합니다");
        } else {
          setError(
            errorData?.error || "페이지를 불러오는데 실패했습니다"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmin();
  }, [auth]);

  if (!mounted || !auth) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-zinc-50/80">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50/80">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <Link
            href="/posts"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            ← 게시판으로
          </Link>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 px-6 py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" />
              <p className="text-sm text-zinc-500">로딩 중...</p>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {error}
              </div>
              {!isAdmin() && (
                <p className="mt-4 text-sm text-zinc-500">
                  관리자 권한이 있는 계정으로 로그인해주세요.
                </p>
              )}
              <Link
                href="/posts"
                className="mt-4 inline-block text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                게시판으로 돌아가기
              </Link>
            </div>
          ) : message ? (
            <div className="p-6">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                {message}
              </h1>
              <p className="mt-2 text-sm text-zinc-500">
                관리자 전용 페이지입니다.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
