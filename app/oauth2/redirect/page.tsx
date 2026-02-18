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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-600">로그인 처리 중...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-600">로그인에 실패했습니다.</p>
        <a
          href="/login"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          로그인 페이지로 이동
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-zinc-600">리다이렉트 중...</p>
    </div>
  );
}

export default function OAuth2RedirectPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">처리 중...</div>}>
      <OAuth2RedirectContent />
    </Suspense>
  );
}
