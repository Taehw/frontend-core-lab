"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/axios";
import { isAuthenticated } from "@/lib/auth";
import PostCard from "@/components/PostCard";
import type { PostListResponse } from "@/lib/types";

export default function PostsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [auth, setAuth] = useState(false);
  const [posts, setPosts] = useState<PostListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likingPostId, setLikingPostId] = useState<number | null>(null);

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

    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get<PostListResponse>("/posts");
        setPosts(data);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { error?: string } } })?.response?.data
            ?.error || "게시글 목록을 불러오는데 실패했습니다";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [auth]);

  const handleLike = async (postId: number) => {
    if (likingPostId) return;
    setLikingPostId(postId);
    try {
      await apiClient.post(`/posts/${postId}/like`);
      const { data } = await apiClient.get<PostListResponse>("/posts");
      setPosts(data);
      router.refresh();
    } catch {
      // 에러 시 무시
    } finally {
      setLikingPostId(null);
    }
  };

  if (!mounted || !auth) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-zinc-50/80">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" />
          <p className="text-sm text-zinc-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50/80">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              게시판
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              커뮤니티 게시글을 확인하고 작성해보세요
            </p>
          </div>
          <Link
            href="/posts/new"
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
          >
            글쓰기
          </Link>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 px-6 py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" />
              <p className="text-sm text-zinc-500">게시글을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="px-6 py-6">
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            </div>
          ) : !posts || posts.posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 px-6 py-16">
              <div className="rounded-full bg-zinc-100 p-4">
                <svg
                  className="h-8 w-8 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium text-zinc-900">
                  게시글이 없습니다
                </p>
                <p className="text-sm text-zinc-500">
                  첫 번째 게시글을 작성해보세요
                </p>
              </div>
              <Link
                href="/posts/new"
                className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
              >
                글쓰기
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-zinc-200">
              {posts.posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  isLiking={likingPostId === post.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
