import express from "express";
import router from "./routes/index.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const port = process.env.PORT ?? 4000;

app.use(express.json());
app.use(router);

app.use("/tmp", express.static(path.join(__dirname, "../tmp")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port as string}`);
});
