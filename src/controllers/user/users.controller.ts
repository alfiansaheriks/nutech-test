import type { Request, Response } from "express";
import { UserService } from "../../services/index.js";
import type { LoginPayload, RegisterPayload, UserUpdatePayload } from "../../types/user.js";
import { successResponse, errorResponse } from "../../helpers/response.helpers.js";

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  async register(req: Request, res: Response) {
    try {
      await this.service.register(req.body as RegisterPayload);
      successResponse(res, 200, 0, "Registrasi Berhasil silahkan login", null);
    } catch (error) {
      errorResponse(res, 400, 0, error instanceof Error ? error.message : "Gagal mendaftar", null);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const token = await this.service.login(req.body as LoginPayload);
      successResponse(res, 200, 0, "Login Sukses", { token });
    } catch (error) {
      errorResponse(res, 401, 103, error instanceof Error ? error.message : "Gagal login", null);
    }
  }

  async profile(req: Request, res: Response) {
    try {
      const user = await this.service.profile(req.user.email);
      successResponse(res, 200, 0, "Sukses", user);
    } catch (error) {
      errorResponse(res, 400, 0, error instanceof Error ? error.message : "Gagal mengambil profile", null);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await this.service.updateProfile(req.user.email, req.body as UserUpdatePayload);
      successResponse(res, 200, 0, "Profile berhasil diperbarui", updated);
    } catch (error) {
      errorResponse(res, 400, 0, error instanceof Error ? error.message : "Gagal memperbarui profile", null);
    }
  }

  async updateImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        errorResponse(res, 400, 106, "Tidak ada file yang diunggah", null);
        return;
      }

      const imageUrl = `/tmp/uploads/profile/${req.file.filename}`;
      const updated = await this.service.updateImage(req.user.email, { profile_image: imageUrl });

      successResponse(res, 200, 0, "Profile berhasil diperbarui", updated);
    } catch (error) {
      errorResponse(res, 400, 0, error instanceof Error ? error.message : "Gagal memperbarui profile", null);
    }
  }
}
