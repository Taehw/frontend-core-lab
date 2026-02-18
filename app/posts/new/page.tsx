"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function NewPostPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50/80">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <Link
            href="/posts"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            ← 게시판으로
          </Link>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            글쓰기
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Phase 3에서 구현 예정입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
