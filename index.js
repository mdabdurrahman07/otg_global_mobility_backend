import dotenv from "dotenv/config";
import app from "./app.js";
import connectDB from "./src/config/database.js";


const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n✅ Server running on port ${PORT}`);
  });
});
