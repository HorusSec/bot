const express = require('express');
const path = require('path');

const app = express();

// Configuração do EJS como mecanismo de visualização
app.set('view engine', 'ejs');

// Configuração do diretório estático
app.use(express.static(path.join(__dirname, 'public')));

// Rota para renderizar o arquivo index.html
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
