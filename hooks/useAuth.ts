"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { apiClient } from "@/lib/axios";
import { setTokens, clearTokens, getAccessToken } from "@/lib/auth";
import type { LoginRequest, SignupRequest, LoginResponse } from "@/lib/types";

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.post<LoginResponse>(
          "/auth/login",
          credentials
        );
        setTokens(data.accessToken, data.refreshToken);
        router.push("/posts");
        router.refresh();
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { error?: string } } })?.response?.data
            ?.error || "로그인에 실패했습니다";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const signup = useCallback(
    async (credentials: SignupRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        await apiClient.post("/auth/signup", credentials);
        router.push("/login?signup=success");
        router.refresh();
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { error?: string } } })?.response?.data
            ?.error || "회원가입에 실패했습니다";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      if (token) {
        await apiClient.post("/auth/logout", null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // 로그아웃 실패해도 토큰은 삭제
    } finally {
      clearTokens();
      router.push("/login");
      router.refresh();
      setIsLoading(false);
    }
  }, [router]);

  const isAuthenticated = useCallback(() => !!getAccessToken(), []);

  return {
    login,
    signup,
    logout,
    isAuthenticated,
    isLoading,
    error,
    setError,
  };
}
