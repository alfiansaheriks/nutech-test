import type { QueryResult } from "pg";
import pool from "../../config/db.js";
import type { ProfileResponse, RegisterPayload, UserResponse, UserUpdateImagePayload, UserUpdatePayload } from "../../types/user.js";

export class UserRepository {
  async store(payload: RegisterPayload): Promise<UserResponse> {
    const query = `INSERT INTO users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [payload.email, payload.first_name, payload.last_name, payload.password];
    const result: QueryResult<UserResponse> = await pool.query(query, values);

    if (!result.rows[0]) {
      throw new Error("Gagal membuat pengguna");
    }

    return result.rows[0];
  }

  async update(email: string, payload: UserUpdatePayload): Promise<QueryResult<ProfileResponse>> {
    const query = `UPDATE users SET first_name = $1, last_name = $2 WHERE email = $3 RETURNING email, first_name, last_name, profile_image`;
    const values = [payload.first_name, payload.last_name, email];
    const result = await pool.query(query, values);
    return result;
  }

  async updateImage(email: string, payload: UserUpdateImagePayload): Promise<QueryResult<ProfileResponse>> {
    const query = `UPDATE users SET profile_image = $1 WHERE email = $2 RETURNING email, first_name, last_name, profile_image`;
    const values = [payload.profile_image, email];
    const result = await pool.query(query, values);
    return result;
  }

  async findByEmail(email: string): Promise<QueryResult<UserResponse>> {
    const query = `SELECT * FROM users WHERE email = $1`;
    const values = [email];
    const result = await pool.query(query, values);
    return result;
  }

  async findProfile(email: string): Promise<QueryResult<ProfileResponse>> {
    const query = `SELECT email, first_name, last_name, profile_image FROM users WHERE email = $1`;
    const values = [email];
    const result = await pool.query(query, values);
    return result;
  }
}
