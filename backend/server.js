const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// route you can check in browser using (localhost:3000/)
app.get("/", (req, res) => {
  res.send("Secure Delivery API Running");
});

// Starting the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

// To start the server go to backend folder in terminal and type (node server.js)
// Then redirect to localhost:3000/ in your browser