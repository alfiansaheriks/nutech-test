import { TransactionRepository } from "../../repositories/index.js";
import type { TopupPayload } from "../../types/transaction.js";

export class TransactionService {
  private transactionRepository: TransactionRepository;
  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  async getBalance(email: string) {
    const { balance } = await this.transactionRepository.findBalance(email);
    return balance;
  }

  async topup(payload: TopupPayload) {
    return await this.transactionRepository.addBalance(payload);
  }

  //   async payment({ email, service_code }: PaymentPayload) {
  //     return await this.transactionRepository.deductBalance({ email, service_code });
  //   }
}
