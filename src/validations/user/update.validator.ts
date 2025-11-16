import type { UserUpdatePayload } from "../../types/user.js";

export const validateUpdate = (body: unknown) => {
  const errors: { status: number; message: string }[] = [];

  if (!body || typeof body !== "object") {
    errors.push({ status: 100, message: "Request tidak valid" });
    return errors;
  }

  const payload = body as UserUpdatePayload;

  if (!payload.first_name) errors.push({ status: 101, message: "Nama depan wajib diisi" });
  if (!payload.last_name) errors.push({ status: 101, message: "Nama belakang wajib diisi" });
  return errors;
};
