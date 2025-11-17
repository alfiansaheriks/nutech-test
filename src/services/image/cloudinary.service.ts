import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import cloudinary from "../../config/cloudinary.js";

export class CloudinaryService {
  async uploadToCloudinary(buffer: Buffer, folder = "profiles"): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "image",
          },
          (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
            if (error) {
              reject(new Error(error.message));
            } else if (result) {
              resolve(result);
            } else {
              reject(new Error("Upload failed: No result returned"));
            }
          },
        )
        .end(buffer);
    });
  }
}
