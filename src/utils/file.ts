import fs from "fs";
import path from "path";

export const deleteFile = (filePath: string) => {
  try {
    const fullPath = path.resolve(filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error("Terjadi error ketika menghapus file:", error);
  }
};
