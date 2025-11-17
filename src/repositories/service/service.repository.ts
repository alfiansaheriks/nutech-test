import pool from "../../config/db.js";
import type { QueryResult } from "pg";
import type { Service } from "../../types/service.js";

export class ServiceRepository {
  async find(): Promise<Service[]> {
    const query = `SELECT service_code, service_name, service_icon, service_tariff FROM services ORDER BY created_at ASC`;
    const result: QueryResult<Service> = await pool.query(query);
    return result.rows;
  }

  async findByCode(service_code: string): Promise<Service> {
    const query = `SELECT service_code, service_name, service_icon, service_tariff FROM services WHERE service_code = $1`;
    const result: QueryResult<Service> = await pool.query(query, [service_code]);
    if (!result.rows[0]) {
      const error = new Error("Service atau status layanan tidak ditemukan");
      error.name = "ServiceNotFound";
      throw error;
    }
    return result.rows[0];
  }
}
