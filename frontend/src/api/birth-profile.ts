import { api } from "./base";

export interface CreateBirthProfileRequest {
  user_id: number;
  date: string;
  time: string;
  place: string;
}

export interface BirthProfileResponse {
  id: number;
  user_id: number;

  date: string;
  time: string;

  place: string;

  latitude: number;
  longitude: number;

  timezone: string;
}

export async function createBirthProfile(
  payload: CreateBirthProfileRequest,
): Promise<BirthProfileResponse> {
  const response = await api.post(
    "/birth-profiles/",
    payload,
  );

  return response.data;
}

export async function getBirthProfile(
  userId: number,
): Promise<BirthProfileResponse> {
  const response = await api.get(
    `/birth-profiles/${userId}`,
  );

  return response.data;
}

export async function updateBirthProfile(
  userId: number,
  payload: CreateBirthProfileRequest,
): Promise<BirthProfileResponse> {
  const response = await api.put(
    `/birth-profiles/${userId}`,
    payload,
  );

  return response.data;
}
