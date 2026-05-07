const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'API do Diário Pet funcionando.' }));

app.use('/api/entries', require('./routes/diaryRoutes'));
app.use('/api/pets', require('./routes/petRoutes'));

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pet_diary')
  .then(() =>
    app.listen(process.env.PORT || 3000, () =>
      console.log(`Servidor rodando`)
    )
  );