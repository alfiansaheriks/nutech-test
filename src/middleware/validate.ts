import type { Request, Response, NextFunction } from "express";
import { errorResponse } from "../helpers/response.helpers.js";

export const validate = (validator: (body: unknown) => { status: number; message: string }[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors = validator(req.body);
    if (errors.length > 0) {
      const firstError = errors[0];
      errorResponse(res, 400, firstError?.status ?? 100, firstError?.message ?? "Validation failed", null);
      return;
    }
    next();
  };
};
