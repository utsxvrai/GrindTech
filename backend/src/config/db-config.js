const dotenv = require("dotenv");
dotenv.config();        
const { PrismaClient } = require("../generated/prisma");

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ log: ["error"] });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ log: ["error"] });
  }
  prisma = global.prisma;
}

module.exports = prisma;
