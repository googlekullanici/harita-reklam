const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// PostgreSQL bağlantısı
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Tablo oluştur
const initDB = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ad_data (
      id INTEGER PRIMARY KEY DEFAULT 1,
      text1 TEXT,
      text2 TEXT,
      text3 TEXT,
      latitude DECIMAL(10, 8) DEFAULT 41.015137,
      longitude DECIMAL(11, 8) DEFAULT 28.97953,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await pool.query(createTableQuery);
    
    const checkData = await pool.query('SELECT * FROM ad_data WHERE id = 1');
    if (checkData.rows.length === 0) {
      await pool.query(`
        INSERT INTO ad_data (id, text1, text2, text3, latitude, longitude)
        VALUES (1, 'Örnek Başlık', 'Örnek açıklama metni buraya gelecek', '₺2,500', 41.015137, 28.97953)
      `);
    }
    console.log('✅ PostgreSQL veritabanı hazır');
  } catch (error) {
    console.error('❌ Veritabanı hatası:', error);
  }
};

initDB();

// ROUTES
app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ad_data WHERE id = 1');
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

app.put('/api/data/texts', async (req, res) => {
  const { text1, text2, text3 } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE ad_data 
       SET text1 = $1, text2 = $2, text3 = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = 1
       RETURNING *`,
      [text1, text2, text3]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

app.put('/api/data/location', async (req, res) => {
  const { latitude, longitude } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE ad_data 
       SET latitude = $1, longitude = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = 1
       RETURNING *`,
      [latitude, longitude]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`🚀 Server http://localhost:${port} portunda çalışıyor`);
});
