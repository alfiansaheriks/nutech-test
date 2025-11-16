import type { LoginPayload } from "../../types/user.js";

export const validateLogin = (body: unknown) => {
  const errors: { status: number; message: string }[] = [];

  if (!body || typeof body !== "object") {
    errors.push({ status: 100, message: "Request tidak valid" });
    return errors;
  }

  const payload = body as LoginPayload;

  if (!payload.email) errors.push({ status: 102, message: "Email wajib diisi" });

  if (!payload.email.includes("@")) errors.push({ status: 102, message: "Parameter email tidak sesuai format" });

  if (!payload.password) errors.push({ status: 103, message: "Password wajib diisi" });
  return errors;
};
