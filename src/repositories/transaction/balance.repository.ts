import type { QueryResult } from "pg";
import pool from "../../config/db.js";
import type { BalanceResponse } from "../../types/transaction.js";

export class BalanceRepository {
  async findUserBalanceForUpdate(email: string): Promise<BalanceResponse> {
    const sql = `
      SELECT u.id, ub.balance 
      FROM users u
      INNER JOIN user_balances ub ON u.id = ub.user_id
      WHERE u.email = $1
      FOR UPDATE
    `;
    const result: QueryResult<BalanceResponse> = await pool.query(sql, [email]);

    if (!result.rows[0]) {
      throw new Error("User Balance tidak ditemukan");
    }

    return result.rows[0];
  }

  async updateBalance(userId: string, newBalance: number, lastBalance: number): Promise<BalanceResponse> {
    const sql = `
      UPDATE user_balances
      SET balance = $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2 AND balance = $3
      RETURNING balance
    `;
    const res: QueryResult<BalanceResponse> = await pool.query(sql, [newBalance, userId, lastBalance]);

    if (!res.rows[0]) {
      throw new Error("Gagal mengupdate balance");
    }

    return res.rows[0];
  }

  async insertBalance(userId: string, balance: number): Promise<BalanceResponse> {
    const sql = `
      INSERT INTO user_balances (user_id, balance)
      VALUES ($1, $2)
      RETURNING balance
    `;
    const res: QueryResult<BalanceResponse> = await pool.query(sql, [userId, balance]);

    if (!res.rows[0]) {
      throw new Error("Gagal membuat balance record");
    }

    return res.rows[0];
  }

  async findBalance(email: string): Promise<BalanceResponse> {
    const sql = `
      SELECT ub.balance
      FROM user_balances ub
      INNER JOIN users u ON ub.user_id = u.id
      WHERE u.email = $1
    `;

    const result: QueryResult<BalanceResponse> = await pool.query(sql, [email]);

    if (!result.rows[0]) {
      throw new Error("Balance tidak ditemukan untuk user ini");
    }

    return result.rows[0];
  }
}

export default new BalanceRepository();
