const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5432;

// CORS - İlk sırada olmalı!
app.use(cors());
app.use(express.json());

// Geçici bellek veritabanı
let adData = {
  id: 1,
  text1: 'Örnek Başlık',
  text2: 'Örnek açıklama metni buraya gelecek',
  text3: '₺2,500',
  latitude: 41.015137,
  longitude: 28.97953,
  updated_at: new Date()
};

console.log('✅ Bellek veritabanı hazır');

// ROUTES

// Verileri getir
app.get('/api/data', (req, res) => {
  console.log('📥 GET /api/data');
  res.json(adData);
});

// Metinleri güncelle
app.put('/api/data/texts', (req, res) => {
  console.log('📝 PUT /api/data/texts');
  console.log('Body:', req.body);
  
  const { text1, text2, text3 } = req.body;
  
  adData.text1 = text1;
  adData.text2 = text2;
  adData.text3 = text3;
  adData.updated_at = new Date();
  
  console.log('✅ Metinler güncellendi');
  res.json(adData);
});

// Konumu güncelle
app.put('/api/data/location', (req, res) => {
  console.log('📍 PUT /api/data/location');
  
  const { latitude, longitude } = req.body;
  
  adData.latitude = latitude;
  adData.longitude = longitude;
  adData.updated_at = new Date();
  
  console.log('✅ Konum güncellendi:', { latitude, longitude });
  res.json(adData);
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`🚀 Server http://localhost:${port} portunda çalışıyor`);
});