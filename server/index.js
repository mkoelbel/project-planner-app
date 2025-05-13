const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});