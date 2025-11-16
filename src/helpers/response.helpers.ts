import type { Response } from "express";

export const successResponse = (res: Response, statusCode = 200, status = 200, message = "Success", data: unknown): void => {
  res.status(statusCode).json({
    status,
    message,
    data,
  });
};

export const errorResponse = (res: Response, statusCode = 500, status = 400, message = "Internal Server Error", data: unknown): void => {
  res.status(statusCode).json({
    status,
    message,
    data,
  });
};
