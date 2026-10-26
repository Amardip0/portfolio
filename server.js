import express from "express";
import dotenv from "dotenv";
import contactHandler from "./api/contact.js";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = 3001;

app.use(express.json());
app.post("/api/contact", contactHandler);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
