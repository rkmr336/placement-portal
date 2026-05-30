import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

connectDB();

const PORT = process.env.PORT || 5000;

<<<<<<< HEAD
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
=======
// Local dev: listen on port
// Vercel serverless: export app
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
>>>>>>> a0774128efee1cf4deafdd131202796e18da0b0f
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;