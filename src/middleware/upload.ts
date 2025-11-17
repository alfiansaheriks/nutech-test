import multer, { type FileFilterCallback, MulterError } from "multer";
import type { Request, Response, NextFunction } from "express";

interface ErrorResponse {
  status: number;
  message: string;
  data: null;
}

export const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "/tmp");
  },
  filename: (_req, file, cb) => {
    const ext = file.originalname.split(".").pop() ?? "bin";
    cb(null, `profile-${Date.now().toString()}.${ext}`);
  },
});

export const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("FORMAT_NOT_ALLOWED"));
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
}).single("file");

export const multerErrorHandler = (err: Error | MulterError | null, _req: Request, res: Response, next: NextFunction): void => {
  if (!err) {
    next();
    return;
  }

  const errorResponse: ErrorResponse = {
    status: 0,
    message: "Gagal mengunggah file",
    data: null,
  };

  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      errorResponse.status = 102;
      errorResponse.message = "Ukuran file terlalu besar. Maksimal 2MB";
    } else if (err.code === "LIMIT_PART_COUNT") {
      errorResponse.status = 102;
      errorResponse.message = "Terlalu banyak bagian dalam permintaan";
    } else if (err.code === "LIMIT_FILE_COUNT") {
      errorResponse.status = 102;
      errorResponse.message = "Terlalu banyak file yang diunggah";
    } else {
      errorResponse.message = err.message;
    }
  } else if (err instanceof Error) {
    if (err.message === "FORMAT_NOT_ALLOWED") {
      errorResponse.status = 102;
      errorResponse.message = "Format image tidak sesuai";
    } else {
      errorResponse.message = err.message;
    }
  }

  res.status(400).json(errorResponse);
};
