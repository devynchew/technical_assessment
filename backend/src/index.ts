// src/index.ts
import express from "express";
import cors from "cors";
import postRoutes from "./routes/postRoutes"; // Import the routes

const app = express();

app.use(cors());
app.use(express.json());

// Use the routes
app.use("/", postRoutes);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

export default app;