import type { RegisterPayload } from "../../types/user.js";

export const validateRegister = (body: unknown): { status: number; message: string }[] => {
  const errors: { status: number; message: string }[] = [];

  if (!body || typeof body !== "object") {
    errors.push({ status: 100, message: "Request tidak valid" });
    return errors;
  }

  const payload = body as RegisterPayload;

  if (!payload.first_name) errors.push({ status: 101, message: "Nama depan wajib diisi" });
  if (!payload.last_name) errors.push({ status: 101, message: "Nama belakang wajib diisi" });

  if (!payload.email) errors.push({ status: 102, message: "Email wajib diisi" });
  if (!payload.email.includes("@")) errors.push({ status: 102, message: "Parameter email tidak sesuai format" });

  if (!payload.password || payload.password.length < 8) errors.push({ status: 103, message: "Password minimal 8 karakter" });

  return errors;
};
