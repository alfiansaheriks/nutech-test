import { errorResponse, successResponse } from "../../helpers/response.helpers.js";
import { ServiceDataService } from "../../services/service/services.service.js";
import type { Request, Response } from "express";

export class ServiceController {
  private serviceDataService: ServiceDataService;
  constructor() {
    this.serviceDataService = new ServiceDataService();
  }

  async getAllServices(req: Request, res: Response) {
    try {
      const services = await this.serviceDataService.get();
      successResponse(res, 200, 0, "Sukses", services);
    } catch (error) {
      console.error("Error service:", error);
      errorResponse(res, 500, 100, "Terjadi Error", null);
    }
  }
}
