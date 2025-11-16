import pool from "../../config/db.js";

interface PaymentType {
  type: string;
}

export const paymentTypeSeeder = async () => {
  try {
    const paymentTypes: PaymentType[] = [{ type: "PAYMENT" }, { type: "TOPUP" }];

    for (const type of paymentTypes) {
      const query = `INSERT INTO transaction_type (type) VALUES ($1) ON CONFLICT (type) DO NOTHING`;
      await pool.query(query, [type.type]);
    }

    console.log("✓ Payment type seeder completed");
  } catch (error) {
    console.error("Error seeding payment types:", error);
  }
};
