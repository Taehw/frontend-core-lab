"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { setTokens } from "@/lib/auth";

function OAuth2RedirectContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const token = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (token && refreshToken) {
      setTokens(token, refreshToken);
      setStatus("success");
      window.location.href = "/posts";
    } else {
      setStatus("error");
    }
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50/80">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" />
        <p className="text-sm text-zinc-500">로그인 처리 중...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50/80 px-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-800">
            로그인에 실패했습니다.
          </p>
          <p className="mt-1 text-xs text-red-600">
            토큰을 받지 못했습니다. 다시 시도해주세요.
          </p>
        </div>
        <a
          href="/login"
          className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-6 py-2 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800"
        >
          로그인 페이지로 이동
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50/80">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" />
      <p className="text-sm text-zinc-500">리다이렉트 중...</p>
    </div>
  );
}

export default function OAuth2RedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50/80">
          <p className="text-sm text-zinc-500">처리 중...</p>
        </div>
      }
    >
      <OAuth2RedirectContent />
    </Suspense>
  );
}
