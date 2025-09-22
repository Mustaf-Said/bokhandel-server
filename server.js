const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(express.json());

const kunderRoutes = require('./routes/kunder');
const bestallningarRoutes = require('./routes/bestallningar');
const bockerRoutes = require('./routes/bocker');
const rapportRoutes = require('./routes/rapport');

app.use('/kunder', kunderRoutes);
app.use('/bestallningar', bestallningarRoutes);
app.use('/bocker', bockerRoutes);
app.use('/rapport', rapportRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Servern körs på http://localhost:${port}`);
});
