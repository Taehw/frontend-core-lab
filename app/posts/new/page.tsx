"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/axios";
import { isAuthenticated } from "@/lib/auth";
import PostForm from "@/components/PostForm";
import type { CreatePostRequest, PostResponse } from "@/lib/types";

export default function NewPostPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [mounted, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const payload: CreatePostRequest = { title, content };
      const { data } = await apiClient.post<PostResponse>("/posts", payload);
      router.push(`/posts/${data.id}`);
      router.refresh();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "게시글 작성에 실패했습니다";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-zinc-50/80">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" />
      </div>
    );
  }

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
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-xl font-semibold tracking-tight text-zinc-900">
            글쓰기
          </h1>
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}
          <PostForm
            title={title}
            content={content}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitLabel="작성하기"
          />
        </div>
      </div>
    </div>
  );
}
