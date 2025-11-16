import pool from "../../config/db.js";
import type { QueryResult } from "pg";
import type { Service } from "../../types/service.js";

export class ServiceRepository {
  async find(): Promise<Service[]> {
    const query = `SELECT service_code, service_name, service_icon, service_tariff FROM services ORDER BY created_at ASC`;
    const result: QueryResult<Service> = await pool.query(query);
    return result.rows;
  }
}
