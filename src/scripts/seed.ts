import { runSeeders } from "../seeders/index.js";

const main = async () => {
  try {
    await runSeeders();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

await main();
