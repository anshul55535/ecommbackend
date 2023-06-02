const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT || 3000

const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(cors())


require('dotenv').config();

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
app.listen(PORT,()=>{
  console.log(`Server start at port no ${PORT}`)
})