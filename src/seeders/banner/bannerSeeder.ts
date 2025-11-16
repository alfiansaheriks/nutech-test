import pool from "../../config/db.js";

interface Banner {
  banner_name: string;
  banner_image: string;
  description: string;
}

export const bannerSeeder = async () => {
  try {
    const banners: Banner[] = [
      {
        banner_name: "Banner 1",
        banner_image: "https://nutech-integrasi.app/dummy.jpg",
        description: "Lerem Ipsum Dolor sit amet",
      },
      {
        banner_name: "Banner 2",
        banner_image: "https://nutech-integrasi.app/dummy.jpg",
        description: "Lerem Ipsum Dolor sit amet",
      },
      {
        banner_name: "Banner 3",
        banner_image: "https://nutech-integrasi.app/dummy.jpg",
        description: "Lerem Ipsum Dolor sit amet",
      },
      {
        banner_name: "Banner 4",
        banner_image: "https://nutech-integrasi.app/dummy.jpg",
        description: "Lerem Ipsum Dolor sit amet",
      },
      {
        banner_name: "Banner 5",
        banner_image: "https://nutech-integrasi.app/dummy.jpg",
        description: "Lerem Ipsum Dolor sit amet",
      },
      {
        banner_name: "Banner 6",
        banner_image: "https://nutech-integrasi.app/dummy.jpg",
        description: "Lerem Ipsum Dolor sit amet",
      },
    ];

    for (const banner of banners) {
      const query = `
        INSERT INTO banners (banner_name, banner_image, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (banner_name) DO NOTHING
      `;
      const values = [banner.banner_name, banner.banner_image, banner.description];
      await pool.query(query, values);
    }

    console.log("✓ Banner seeder completed");
  } catch (error) {
    console.error("✗ Banner seeder failed:", error);
    throw error;
  }
};
