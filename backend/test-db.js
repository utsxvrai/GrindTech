const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("Connecting to:", process.env.DATABASE_URL.split('@')[1]); // Log host part only
    await client.connect();
    console.log("Connection successful!");
    const res = await client.query('SELECT NOW()');
    console.log("Database time:", res.rows[0]);
    await client.end();
  } catch (err) {
    console.error("Connection failed details:", err.message);
    if (err.code) console.error("Error code:", err.code);
  }
}

testConnection();
