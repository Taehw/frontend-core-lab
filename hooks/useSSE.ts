"use client";

import { useEffect, useRef } from "react";
import { getAccessToken } from "@/lib/auth";
import type { NotificationResponse } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * SSE 알림 구독 훅
 * EventSource는 헤더 설정 불가 → token을 쿼리 파라미터로 전달
 */
export function useSSE(onNotification: (notification: NotificationResponse) => void) {
  const onNotificationRef = useRef(onNotification);
  onNotificationRef.current = onNotification;

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    const url = `${API_URL}/notifications/subscribe?token=${encodeURIComponent(token)}`;
    const eventSource = new EventSource(url);

    eventSource.addEventListener("connect", () => {
      // 연결 완료
    });

    eventSource.addEventListener("notification", (event) => {
      try {
        const data = JSON.parse(event.data) as NotificationResponse;
        onNotificationRef.current(data);
      } catch {
        // 파싱 실패 시 무시
      }
    });

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);
}
