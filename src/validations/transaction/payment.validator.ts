import type { PaymentPayload } from "../../types/transaction.js";

export const validatePayment = (body: unknown): { status: number; message: string }[] => {
  const errors: { status: number; message: string }[] = [];
  const payload = body as PaymentPayload;

  if (!payload.service_code || payload.service_code.length === 0) {
    errors.push({ status: 101, message: "Parameter service_code wajib diisi" });
  }

  return errors;
};
