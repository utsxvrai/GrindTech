const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const prisma = require("./config/db-config"); 


const app = express();

/* ---------- CORS ---------- */
app.use(
  cors({
    origin: [
      "https://grindtech.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

/* ---------- BODY PARSER ---------- */
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

/* ---------- ROUTES ---------- */
app.use("/api", routes);

/* ---------- HEALTH CHECK ---------- */
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

/* ---------- DB WARMUP ---------- */
async function warmDB() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Neon DB warmed");
  } catch (e) {
    console.error("DB warm failed", e);
  }
}



/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  if (process.env.NODE_ENV === "production") {
    warmDB();
  }
});
