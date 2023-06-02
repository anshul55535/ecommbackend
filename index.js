const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors())
app.use('/uploads', express.static('uploads')); 




mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error.message));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })) 
const userRoutes = require("./routes/account");  
const sellerRoutes = require("./routes/seller");
// const productSearchRoutes = require("./routes/product-search");

// app.use("/", mainRoutes

app.use("/accounts", userRoutes);
app.use('/main', sellerRoutes )

// app.use("/search", productSearchRoutes);

app.listen(3000, (err) => {
  console.log("Server sterted....................  " + 3000);
});
