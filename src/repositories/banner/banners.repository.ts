import pool from "../../config/db.js";
import type { QueryResult } from "pg";
import type { Banner } from "../../types/banner.js";

export class BannerRepository {
  async find(): Promise<Banner[]> {
    const query = `
      SELECT banner_name, banner_image, description 
      FROM banners 
      ORDER BY created_at ASC
    `;
    const result: QueryResult<Banner> = await pool.query(query);
    return result.rows;
  }
}
