"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/axios";
import { isAuthenticated } from "@/lib/auth";
import type { PostResponse } from "@/lib/types";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const [mounted, setMounted] = useState(false);
  const [auth, setAuth] = useState(false);
  const [post, setPost] = useState<PostResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (!auth || !postId) return;

    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get<PostResponse>(`/posts/${postId}`);
        setPost(data);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { error?: string } } })?.response?.data
            ?.error || "게시글을 불러오는데 실패했습니다";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [auth, postId]);

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
            <div className="px-6 py-6">
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            </div>
          ) : post ? (
            <div className="p-6">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                {post.title}
              </h1>
              <div className="mt-3 flex items-center gap-3 text-sm text-zinc-500">
                <span>{post.authorName}</span>
                <span>{formatDate(post.createdAt)}</span>
                <span className="flex items-center gap-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {post.likeCount}
                </span>
              </div>
              <div className="mt-6 whitespace-pre-wrap text-zinc-700">
                {post.content}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
