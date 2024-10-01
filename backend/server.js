const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
  }

  try {
    const { data: { text } } = await Tesseract.recognize(
      req.file.path,
      'por',
      { logger: m => console.log(m) }
    );
    res.json({ text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar a imagem.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});
