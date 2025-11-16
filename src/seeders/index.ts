import { bannerSeeder } from "./banner/bannerSeeder.js";
import { serviceSeeder } from "./service/serviceSeeder.js";
import { paymentTypeSeeder } from "./transaction/paymentType.seeder.js";

export const runSeeders = async () => {
  try {
    await bannerSeeder();
    await serviceSeeder();
    await paymentTypeSeeder();
    console.log("Seeder sudah di jalankan!");
  } catch (error) {
    console.error("Seeder failed:", error);
    process.exit(1);
  }
};
