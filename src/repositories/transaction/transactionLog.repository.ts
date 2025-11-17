import pool from "../../config/db.js";
import type { TransactionLog, TransactionLogResponse } from "../../types/transaction.js";
import type { QueryResult } from "pg";

export class TransactionLogRepository {
  async getPaymentType(type: string) {
    const query = `SELECT id FROM transaction_type WHERE type = $1`;
    const result: QueryResult<{ id: string }> = await pool.query(query, [type]);
    if (!result.rows[0]) {
      throw new Error("Gagal mendapatkan id transaksi");
    }
    return result.rows[0].id;
  }

  async getTransactionHistory(email: string, offset = 0, limit = 10) {
    const query = `SELECT ut.invoice_number, (SELECT type FROM transaction_type WHERE id = ut.transaction_type_id) as transaction_type, ut.description, ut.total_amount, ut.created_at as created_on FROM user_transactions ut INNER JOIN users u ON ut.user_id = u.id WHERE u.email = $1 ORDER BY ut.created_at DESC LIMIT $2 OFFSET $3`;
    const result: QueryResult<TransactionLogResponse> = await pool.query(query, [email, limit, offset]);
    return result.rows;
  }

  async logTransaction({
    user_id,
    transaction_type_id,
    invoice_number,
    description,
    total_amount,
    balance_before,
    balance_after,
  }: TransactionLog): Promise<TransactionLogResponse> {
    const query = `INSERT INTO user_transactions (user_id, transaction_type_id, invoice_number, description, total_amount, balance_before, balance_after) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING invoice_number, created_at as created_on, description, total_amount, (SELECT type FROM transaction_type WHERE id = transaction_type_id) as transaction_type, created_at as created_on`;
    const value = [user_id, transaction_type_id, invoice_number, description, total_amount, balance_before, balance_after];
    const result: QueryResult<TransactionLogResponse> = await pool.query(query, value);
    if (!result.rows[0]) {
      throw new Error("Gagal menambahkan log transaksi");
    }
    return result.rows[0];
  }
}
