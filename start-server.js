import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 81;

app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname + '/build/index.html'));
});

app.listen(PORT);
console.log('Client has been started on ' + PORT + '...');
