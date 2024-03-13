const express = require('express');
const app = express();

// Middleware and routes will be added here


// add root endpoint / as a simple example
app.get('/', (req, res) => {
  res.send('Quraan.me APIs server: Running...');
});

var MONGODB_URL = "mongodb+srv://Quraanuser:1FJCJqTkurTbsSjr@quraancluster.qkudg.mongodb.net/quraandb?retryWrites=true&w=majority";
var mongoose = require("mongoose");
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        //don't show the log when it is test
        if (process.env.NODE_ENV !== "test") {
            console.clear();
            console.log("Connected to %s", 'MONGODB_URL');
            console.log("App is running ... \n", 'http://localhost:3000');
            console.log("Press CTRL + C to stop the process. \n");
        }
    })
    .catch(err => {
        console.error("App starting error:", err.message);
        process.exit(1);
    });
var db = mongoose.connection;



const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add routes for /crud
app.use('/crud', require('./app/routes/crud'));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});