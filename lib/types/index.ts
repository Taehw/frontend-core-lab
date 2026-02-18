/**
 * 백엔드 DTO 기반 API 타입 정의
 */

// ============ Auth ============
export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  email?: string;
  role: "USER" | "ADMIN";
  userId?: number;
}

export interface SignupResponse {
  userId: number;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  message: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

// ============ Post ============
export interface CreatePostRequest {
  title: string;
  content: string;
}

export interface UpdatePostRequest {
  title: string;
  content: string;
}

export interface PostResponse {
  id: number;
  title: string;
  content: string;
  authorName: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostListResponse {
  posts: PostResponse[];
  totalCount: number;
}

// ============ Notification ============
export interface NotificationResponse {
  id: number;
  message: string;
  postId: number;
  isRead: boolean;
  createdAt: string;
}

// ============ API Error ============
export interface ApiErrorResponse {
  error?: string;
  message?: string;
}
