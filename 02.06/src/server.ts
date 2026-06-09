import express from 'express';

const app = express();
const PORTA = 3000;

app.use(express.json());

app.get('/servidor', (req, res) => {
  res.status(200).send('Servidor rodando! Xablau');
});

app.listen(PORTA, () => {
  console.log('Servidor no ar! UHUL');
});