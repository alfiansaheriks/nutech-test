import { errorResponse, successResponse } from "../../helpers/response.helpers.js";
import { BannerService } from "../../services/index.js";
import type { Request, Response } from "express";

export class BannerController {
  private bannerService: BannerService;

  constructor() {
    this.bannerService = new BannerService();
  }

  async getBanners(_req: Request, res: Response) {
    try {
      const banners = await this.bannerService.get();
      successResponse(res, 200, 0, "Sukses", banners);
    } catch (error) {
      console.error("Error Banner: ", error);
      errorResponse(res, 500, 100, "Terjadi Error", null);
      return;
    }
  }
}
