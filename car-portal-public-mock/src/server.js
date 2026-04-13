require('dotenv').config();
const express = require('express');
const mockSsoRoutes = require('./routes/mockSsoRoutes');

const app = express();
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[mock-sso] ${req.method} ${req.url}`, req.body || {});
  next();
});

app.get('/health', (_req, res) => {
  res.json({ code: 200, msg: 'ok' });
});

app.use(mockSsoRoutes);

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`portal-mock-sso listening on ${port}`);
});
