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



/* ---------- SOCKET.IO ---------- */
initSocket(server);

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});
