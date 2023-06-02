
// Seller.JS file to maintain every sellers details and storing the resources on AWS

//Including the required packages and assigning it to Local Variables
const express = require("express");

const router = require("express").Router();
const Product = require("../models/product");
const Category = require("../models/category");



const multer = require("multer");
const checkJWT = require('../JWT/jwt');
const Review = require("../models/review");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now + "_" + file.originalname);
  },
});

const upload = multer({ storage });
router.get("/search/:text", async (req, res, next) => {
  try {
    const regex = new RegExp(req.params.text, "i");

    const products = await Product.find({ title: regex })
      .populate("category")
      .populate("owner")
      .populate('reviews')
      .exec();

    if (products.length > 0) {
      res.json({
        success: true,
        products: products,
        message:'Products found'
      });
    } else {
      res.json({
        success: false,
        message: 'No products found...!!'
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/sellersearch/:text", checkJWT, async (req, res, next) => {


  try {
    const regex = new RegExp(req.params.text, "i");

    const products = await Product.find({ owner: req.decoded.user._id, title: regex })
      .populate("category")
      .populate("owner")
      .populate('reviews')

      .exec();

    if (products.length > 0) {
      res.json({
        success: true,
        products: products
      });
    } else {
      res.json({
        success: false,
        message: 'No products found...!!'
      });
    }
  } catch (err) {
    next(err);
  }
});





router.get("/category/:text", async (req, res, next) => {
  try {
    const regex = new RegExp(req.params.text, "i");
    const products = await Product.find()
    .populate('owner', '-password')
          .populate({
        path: "category",
        match: { name: { $regex: regex } }

      })
      .exec();

    const filteredProducts = products.filter(product => product.category !== null);
    // console.log(filteredProducts);
    if (filteredProducts.length > 0) {
           res.json({
        success: true,
        products: filteredProducts,
        message:'products found'
      });
    } else {
      res.json({
        success: false,
        message: 'No products found...!!'
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/sellercategory/:text", checkJWT, async (req, res, next) => {
  try {
    const categoryName = req.params.text;
    const ownerEmail = req.decoded.user.email;
    const regex = new RegExp(req.params.text, "i");
    const products = await Product.find()
      .populate({ path: "category", match: { name: categoryName } })
      .populate({ path: "owner", match: { email: ownerEmail } ,select: "-password"})
      .exec();

    const filteredProducts = products
      .filter(product => product.category !== null && product.owner !== null);
    // console.log(filteredProducts);
    if (filteredProducts.length > 0) {``
      res.json({
        success: true,
        products: filteredProducts
      });
    } else {
      res.json({
        success: false,
        message: 'No products found...!!'
      });
    }
  } catch (err) {
    next(err);
  }
});



// const product = await Product.find({title:req.query}).populate("owner").populate("category")
//   if (product) {
//     res.status(200).json(product)
//   }


router.get("/products", async (req, res, next) => {

  const product = await Product.find().populate("owner",'-password').populate("category").populate('reviews')

  if (product) {
    res.status(200).json({product :product, success:true,message:'Products Found'})
  }
  else{
    res.status(200).json({ success:false, message:'No Product found'})

  }
})


//Function to handle the product's GET and POST requests by seller
router.get("/sellerproducts", checkJWT, async (req, res, next) => {

  if (req.decoded.user.isSeller) {
    const product = await Product.find({ owner: req.decoded.user._id })
    .populate('owner', '-password')
          .populate("category")
      .populate('reviews')



      if (product) {
        res.status(200).json({product :product, success:true,message:'Products Found'})
      }
      else{
        res.json({ success:false, message:'No Product found'})
    
      }
  }

  else {
    const product = await Product.find()
    .populate('owner', '-password')
        .populate("category").populate('reviews')

    if (product) {
      res.status(200).json({product :product, success:true,message:'Products Found'})
    }
    else{
      res.status(200).json({ success:false, message:'No Product found'})
  
    }
  }






})




router.get("/categories", async (req, res,) => {
  const category = await Category.find()
  if (category) {
    res.json({
      success: true,
      message: "Success",
      categories: category,
    });
  }   
});

router.post("/categories", checkJWT, (req, res, next) => {

  if (req.decoded.user.isSeller) {
    let category = new Category();
    category.name = req.body.category;
    category.save();
    if (category) {
      res.status(200).json({ success:true,message:'category Added successfully...!!'})
    }
    else{
      res.json({ success:false, message:'No Category Added'})
  
    }}
});


router.post("/products", [checkJWT, upload.single("image")], (req, res, next) => {


  if (req.decoded.user.isSeller) {
    let product = new Product();
    product.owner = req.decoded.user._id;
    product.category = req.body.category;
    product.title = req.body.title;
    product.price = req.body.price;
    product.quantity = req.body.quantity;
    product.description = req.body.description;
    product.image = req.file.filename
    product.save();
    res.json({
      success: true,
      message: "Successfully Added the product",
    });
  }
  
  else{
    res.json({ success:false, message:'Failed to Add Product '})

  }
});



router.get("/products/:id", async (req, res) => {

  const product = await Product.findById({ _id: req.params.id })
  .populate('owner', '-password')
      .populate("category")
    .populate('reviews')



  res.json({
    success: true,
    message: "Successfully reteive the product",
    product: product
  });


});




router.put("/editproducts/:id", [checkJWT, upload.single("image")], (req, res, next) => {


  if (req.decoded.user.isSeller) {
    Product.findByIdAndUpdate(req.params.id, {
      owner: req.decoded.user._id,
      category: req.body.category,
      title: req.body.title,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description,
      image: req.file.filename,
    })
      .then(() => {
      
        res.json({
          success: true,
          message: "Successfully updated the product",
        });
      })
      .catch((error) => {
        res.json({
          success: false,
          message: "Failed to update the product",
          error: error.message,
        });
      });

  } else {
    res.json({
      success: false,
      message: "You are Not Authorized",
      error: error.message,
    });
  }

}


)


router.post('/reviews', checkJWT, async (req, res) => {
  try {
    const prod = await Product.findById(req.body.productid).populate('reviews');
    const testprod = 
    prod.reviews.find(review => review.owner === req.decoded.user.email);

    const createReview = async () => {
      const review = new Review();
      review.owner = req.decoded.user.email;
      review.title = req.body.title;
      review.description = req.body.description;
      review.rating = req.body.rating;

      await review.save();

      const product = await Product.findByIdAndUpdate(
        req.body.productid,
        { $push: { reviews: review._id } },
        { new: true }
      ).exec();

      const reviews = product.reviews;

      // Calculate the average rating for each product
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = totalRating / reviews.length;

      product.avgrating = avgRating;
      await product.save();

      return product;
    };


    if (!testprod) {
      const product = await createReview();
      res.json({
        message: 'Successfully added review',
        success: true,
        product: product
      });
    } else {
      res.json({ message: 'You have already submitted a review' });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
});



//Exporting the module
module.exports = router;