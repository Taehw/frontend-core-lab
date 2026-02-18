"use client";

import Link from "next/link";
import { getUsernameFromToken } from "@/lib/auth";
import type { PostResponse } from "@/lib/types";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (days < 7) {
    return `${days}일 전`;
  }
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface PostCardProps {
  post: PostResponse;
  onLike?: (postId: number) => void;
  isLiking?: boolean;
}

export default function PostCard({
  post,
  onLike,
  isLiking = false,
}: PostCardProps) {
  const currentUsername = getUsernameFromToken();
  const isAuthor =
    !!currentUsername && post.authorName === currentUsername;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthor && onLike) onLike(post.id);
  };

  return (
    <Link
      href={`/posts/${post.id}`}
      className="block border-b border-zinc-200 px-6 py-4 transition-colors hover:bg-zinc-50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-zinc-900">{post.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
            {post.content}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
            <span>{post.authorName}</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLikeClick}
          disabled={isAuthor || isLiking}
          className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent"
          title={isAuthor ? "본인 글" : "좋아요"}
        >
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
          <span>{post.likeCount}</span>
        </button>
      </div>
    </Link>
  );
}
