import { api } from "./base";

export interface CreateUserRequest {
  name: string;
}

export interface UserResponse {
  id: number;
  name: string;
}

export async function createUser(
  payload: CreateUserRequest,
): Promise<UserResponse> {
  const response = await api.post(
    "/users/",
    payload,
  );

  return response.data;
}

export async function getUser(
  userId: number,
): Promise<UserResponse> {
  const response = await api.get(
    `/users/${userId}`,
  );

  return response.data;
}
