import express from "express";
import pg from "pg";
import connectPgSimple from "connect-pg-simple";
const app = express();
const port = process.env.PORT || 3000;
const { Pool } = pg;
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
app.get("/", (req, res) => {
    res.render("index");
});
app.listen(port, () => {
    console.log(Listening on port ${port}.);
});
app.post('/devices', async (req, res) => {
    const { device_name, device_type } = req.body;
  
    if (!device_name || !device_type) {
      return res.status(400).json({ error: 'device_name and device_type are required' });
    }
  
    try {
      const query = 'INSERT INTO devices (device_name, device_type) VALUES ($1, $2) RETURNING *';
      const values = [device_name, device_type];
  
      const result = await pool.query(query, values);
      res.status(201).json({ message: 'Device added successfully', device: result.rows[0] });
    } catch (error) {
      console.error('Error inserting device:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });