import { BalanceRepository } from "../../repositories/index.js";
import type { PaymentPayload, TopupPayload } from "../../types/transaction.js";
import { ServiceRepository } from "../../repositories/service/service.repository.js";
import pool from "../../config/db.js";
import { TransactionLogRepository } from "../../repositories/transaction/transactionLog.repository.js";
import { dateStr } from "../../utils/date.js";

export class TransactionService {
  private balanceRepository: BalanceRepository;
  private serviceRepository: ServiceRepository;
  private transactionRepository: TransactionLogRepository;
  private invoiceNumber: string;

  constructor() {
    this.balanceRepository = new BalanceRepository();
    this.serviceRepository = new ServiceRepository();
    this.transactionRepository = new TransactionLogRepository();
    this.invoiceNumber = `INV${dateStr}-${Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(3, "0")}`;
  }

  async getBalance(email: string) {
    return await this.balanceRepository.findBalance(email);
  }

  async topupBalance({ email, top_up_amount }: TopupPayload) {
    try {
      await pool.query(`BEGIN`);
      const user = await this.balanceRepository.findUserBalanceForUpdate(email);
      const newBalance = user.balance + top_up_amount;
      const updatedBalance = await this.balanceRepository.updateBalance(user.id, newBalance, user.balance);
      const paymentType = await this.transactionRepository.getPaymentType("TOPUP");
      await this.transactionRepository.logTransaction({
        user_id: user.id,
        transaction_type_id: paymentType,
        invoice_number: this.invoiceNumber,
        description: "Top up balance",
        total_amount: top_up_amount,
        balance_before: user.balance,
        balance_after: newBalance,
      });
      await pool.query(`COMMIT`);
      return updatedBalance;
    } catch (error) {
      await pool.query(`ROLLBACK`);
      throw error;
    }
  }

  async payment({ email, service_code }: PaymentPayload) {
    try {
      await pool.query(`BEGIN`);
      const user = await this.balanceRepository.findUserBalanceForUpdate(email);
      const service = await this.serviceRepository.findByCode(service_code);

      const newBalance = user.balance - service.service_tariff;
      if (newBalance < 0) {
        throw new Error("Saldo tidak mencukupi");
      }
      await this.balanceRepository.updateBalance(user.id, newBalance, user.balance);
      const paymentType = await this.transactionRepository.getPaymentType("PAYMENT");
      const logTransaction = await this.transactionRepository.logTransaction({
        user_id: user.id,
        transaction_type_id: paymentType,
        invoice_number: this.invoiceNumber,
        description: service.service_name,
        total_amount: service.service_tariff,
        balance_before: user.balance,
        balance_after: newBalance,
      });
      await pool.query(`COMMIT`);
      const data = {
        invoice_number: this.invoiceNumber,
        service_code: service.service_code,
        service_name: service.service_name,
        transaction_type: "PAYMENT",
        total_amount: service.service_tariff,
        created_on: logTransaction.created_on,
      };
      return data;
    } catch (error) {
      await pool.query(`ROLLBACK`);
      throw error;
    }
  }

  async getTransactionHistory(email: string, offset = 0, limit = 10) {
    return await this.transactionRepository.getTransactionHistory(email, offset, limit);
  }
}
