"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function PostsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [auth, setAuth] = useState(false);

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

  if (!mounted || !auth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-600">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">게시판</h1>
      <p className="text-zinc-600">
        게시글 목록이 여기에 표시됩니다. (Phase 3에서 구현)
      </p>
    </div>
  );
}
