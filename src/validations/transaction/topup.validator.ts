import type { TopupPayload } from "../../types/transaction.js";

export const validateTopup = (body: unknown): { status: number; message: string }[] => {
  const errors: { status: number; message: string }[] = [];
  const payload = body as TopupPayload;

  if (!payload.top_up_amount || payload.top_up_amount <= 0) {
    errors.push({ status: 102, message: "Parameter amount hanya boleh angka" });
  }

  return errors;
};
