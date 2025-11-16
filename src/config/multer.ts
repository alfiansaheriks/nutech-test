import multer from "multer";

export const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/profile/");
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now().toString() + "-" + Math.round(Math.random() * 1e9).toString();
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Format Image tidak sesuai"));
  },
});
