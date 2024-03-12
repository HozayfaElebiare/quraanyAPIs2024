const express = require('express');
const app = express();

// Middleware and routes will be added here

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});