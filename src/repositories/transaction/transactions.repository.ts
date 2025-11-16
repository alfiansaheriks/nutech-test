import type { QueryResult } from "pg";
import pool from "../../config/db.js";
import type { BalanceResponse, TopupPayload } from "../../types/transaction.js";

export class TransactionRepository {
  async findBalance(email: string): Promise<BalanceResponse> {
    const query = `SELECT balance FROM user_balances ub INNER JOIN users u ON ub.user_id = u.id WHERE u.email = $1`;
    const value = [email];
    const result: QueryResult<BalanceResponse> = await pool.query(query, value);
    if (!result.rows[0]) {
      throw new Error("Balance tidak ditemukan untuk user ini");
    }
    return result.rows[0];
  }

  async addBalance({ email, top_up_amount }: TopupPayload): Promise<BalanceResponse> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      const invoiceNumber = `INV-${Date.now().toString()}-${Math.floor(Math.random() * 1000).toString()}`;

      const userQuery = `
        SELECT u.id, ub.balance 
        FROM users u
        LEFT JOIN user_balances ub ON u.id = ub.user_id
        WHERE u.email = $1
        FOR UPDATE
      `;
      const userResult = await client.query(userQuery, [email]);

      if (userResult.rows.length === 0) {
        await client.query("ROLLBACK");
        throw new Error("User tidak ditemukan");
      }

      const { id: user_id, balance: current_balance } = userResult.rows[0] as { id: string; balance: number | null };
      const newBalance = (current_balance ?? 0) + top_up_amount;

      const updateQuery = `
        UPDATE user_balances 
        SET balance = $1, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $2
        RETURNING balance, user_id
      `;
      const updateResult: QueryResult<BalanceResponse> = await client.query(updateQuery, [newBalance, user_id]);

      if (updateResult.rows.length === 0) {
        const insertQuery = `
          INSERT INTO user_balances (user_id, balance)
          VALUES ($1, $2)
          RETURNING balance, user_id
        `;
        const insertResult: QueryResult<BalanceResponse> = await client.query(insertQuery, [user_id, newBalance]);

        if (!insertResult.rows[0]) {
          await client.query("ROLLBACK");
          throw new Error("Gagal membuat balance record");
        }

        const logQuery = `
          INSERT INTO user_transactions (user_id, transaction_type_id, invoice_number, description, total_amount, balance_before, balance_after)
          VALUES ($1, (SELECT id FROM transaction_type WHERE type = 'TOPUP'), 
                  $2, 'Top up saldo', $3, $4, $5)
        `;
        await client.query(logQuery, [user_id, invoiceNumber, top_up_amount, current_balance ?? 0, newBalance]);

        await client.query("COMMIT");
        return insertResult.rows[0];
      }

      const logQuery = `
        INSERT INTO user_transactions (user_id, transaction_type_id, invoice_number, description, total_amount, balance_before, balance_after)
        VALUES ($1, (SELECT id FROM transaction_type WHERE type = 'TOPUP'), 
                $2, 'Top up saldo', $3, $4, $5)
      `;
      await client.query(logQuery, [user_id, invoiceNumber, top_up_amount, current_balance ?? 0, newBalance]);

      await client.query("COMMIT");

      if (!updateResult.rows[0]) {
        throw new Error("Gagal mengupdate balance");
      }

      return updateResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
