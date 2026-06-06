// src/api/natal-chart.ts

import { api } from "./base";

export async function getNatalChart(
  userId: number,
) {
  const response = await api.get(
    `/natal-charts/${userId}`,
  );

  return response.data;
}
