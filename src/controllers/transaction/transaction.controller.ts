import { errorResponse, successResponse } from "../../helpers/response.helpers.js";
import { TransactionService } from "../../services/index.js";
import type { Request, Response } from "express";
import type { PaymentPayload, TopupPayload } from "../../types/transaction.js";

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  async getBalance(req: Request, res: Response) {
    try {
      const balance = await this.transactionService.getBalance(req.user.email);
      successResponse(res, 200, 0, "Sukses", balance);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        errorResponse(res, 500, 0, error.message, null);
      }
    }
  }

  async topupBalance(req: Request, res: Response) {
    try {
      const payload = req.body as TopupPayload;
      const balance = await this.transactionService.topupBalance({ email: req.user.email, top_up_amount: payload.top_up_amount });
      successResponse(res, 200, 0, "Sukses", balance);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        errorResponse(res, 500, 0, error.message, null);
      }
    }
  }

  async payment(req: Request, res: Response) {
    try {
      const payload = req.body as PaymentPayload;
      const transaction = await this.transactionService.payment({ email: req.user.email, service_code: payload.service_code });
      successResponse(res, 200, 0, "Sukses", transaction);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        if (error.name === "ServiceNotFound") {
          errorResponse(res, 404, 102, error.message, null);
        } else {
          errorResponse(res, 500, 102, error.message, null);
        }
      }
    }
  }

  async transactionHistory(req: Request, res: Response) {
    try {
      const offset = parseInt(req.query.offset as string) || 0;
      const limit = parseInt(req.query.limit as string) || 10;
      const transactionHistory = await this.transactionService.getTransactionHistory(req.user.email, offset, limit);
      const responseData = {
        offset,
        limit,
        records: transactionHistory,
      };
      successResponse(res, 200, 0, "Sukses", responseData);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        errorResponse(res, 500, 0, error.message, null);
      }
    }
  }
}
