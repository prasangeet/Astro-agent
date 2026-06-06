// src/api/chat.ts

import { api } from "./base";

export interface ChatRequest {
  user_id: number;
  message: string;
}

export interface ChatResponse {
  response: string;
}

export async function sendMessage(
  payload: ChatRequest,
): Promise<ChatResponse> {
  const response = await api.post(
    "/chat/",
    payload,
  );

  return response.data;
}
