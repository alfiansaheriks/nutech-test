import { errorResponse, successResponse } from "../../helpers/response.helpers.js";
import { TransactionService } from "../../services/index.js";
import type { Request, Response } from "express";

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  async getBalance(req: Request, res: Response) {
    try {
      const balance = await this.transactionService.getBalance(req.user.email);
      successResponse(res, 200, 0, "Sukses", { balance });
    } catch (error) {
      errorResponse(res, 400, 100, error instanceof Error ? error.message : "Gagal mengambil saldo", null);
    }
  }
}
