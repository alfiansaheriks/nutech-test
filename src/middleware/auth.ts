import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../helpers/response.helpers.js";
import { verify } from "../utils/jwt.js";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    errorResponse(res, 401, 108, "Token tidak valid atau kadaluwarsa", null);
    return;
  }

  if (!authHeader.startsWith("Bearer ")) {
    errorResponse(res, 401, 108, "Token tidak valid atau kadaluwarsa", null);
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    errorResponse(res, 401, 108, "Token tidak valid atau kadaluwarsa", null);
    return;
  }

  try {
    const decoded = verify(token);
    req.user = decoded;
    next();
  } catch {
    errorResponse(res, 401, 108, "Token tidak valid atau kadaluwarsa", null);
    return;
  }
};
