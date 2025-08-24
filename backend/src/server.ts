import app from "./app";
import { connectDB } from "./config/db";

const port = Number(process.env.PORT) || 4000;

(async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log(`🚀 Server on http://localhost:${port}`));
  } catch (err) {
    console.error("DB connect/start error", err);
    process.exit(1);
  }
})();