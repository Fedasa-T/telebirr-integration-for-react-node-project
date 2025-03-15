import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import createOrder from "./service/CreateOrderService.js";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ Use only `cors()`, remove manual headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Use env variable
    credentials: true,
  })
);

app.post("/create/order", createOrder.createOrder); // Simplify function call

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
