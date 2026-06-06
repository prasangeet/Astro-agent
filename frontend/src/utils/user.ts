export function getUserId(): number | null {
  const value =
    localStorage.getItem("user_id");

  return value
    ? Number(value)
    : null;
}

export function getUserName(): string | null {
  return localStorage.getItem(
    "user_name",
  );
}

export function saveUser(
  id: number,
  name: string,
) {
  localStorage.setItem(
    "user_id",
    id.toString(),
  );

  localStorage.setItem(
    "user_name",
    name,
  );
}

export function clearUser() {
  localStorage.removeItem(
    "user_id",
  );

  localStorage.removeItem(
    "user_name",
  );
}
