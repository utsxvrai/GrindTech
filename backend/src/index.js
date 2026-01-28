const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");

const routes = require("./routes");
const prisma = require("./config/db-config");
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);

/* ---------- CORS ---------- */
app.use(
  cors({
    origin: [
      "https://grindtech.vercel.app",
      "http://localhost:5173",
      "https://grindtech.work.gd",
      "http://grindtech.work.gd",
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
    console.log("Neon DB warmed successfully");
  } catch (e) {
    console.log("⚠️ DB warmup failed. This is common if the Neon endpoint is suspended or if you're offline.");
    console.log("   The app will still try to connect when you make an actual request.");
  }
}

/* ---------- SOCKET.IO ---------- */
initSocket(server);

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  if (process.env.NODE_ENV === "production") {
    warmDB();
  }
});
