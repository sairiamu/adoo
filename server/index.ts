import express from 'express';

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Adoo server listening on http://localhost:${port}`);
});
