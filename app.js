const express = require('express');
const app = express();

// Middleware and routes will be added here


// add root endpoint / as a simple example
app.get('/', (req, res) => {
  res.send('Quraan.me APIs server: Running...');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});