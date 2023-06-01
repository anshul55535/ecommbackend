const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const checkJWT = require("../JWT/jwt.js");
const Order = require("../models/orders");


router.post("/signup", async (req, res) => {

  const user = await User.findOne({ email: req.body.email })


  if (user) {
    res.json({
      success: false,
      message: "User already exist",
    });

  } else {

    const user = await User.create(req.body)
    const secretKey = 'myecomm';

    const token = jwt.sign({ user }, secretKey, { expiresIn: '24hr' })
    res.json({
      success: true,
      message: "SingUp Successfully....",
      token: token,
    });
  }

});


router.get("/user", checkJWT, async (req, res, next) => {
  const user = await User.findOne({ email: req.decoded.user.email })


  if (!user) {
    res.json({
      success: false,
      message: "User account cannot be found",
    });

  } else {


    res.json(user);
  }

});

router.post("/login", async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })



  if (!user) {
    res.json({
      success: false,
      message: "Invalid user",
    });

  } else {
    if (user.password == req.body.password) {




      const secretKey = 'myecomm';

      const token = jwt.sign({ user }, secretKey, { expiresIn: '24hr' })
      res.json({
        success: true,
        user: user,
        message: "Login successful...",
        token: token,
      });
    }else{


      res.json({
        success: false,
        message: "Invalid user",
      });
      
    }
  }

});


router.get("/orders", checkJWT, async (req, res, next) => {
  const orders = await Order.find({ owner: req.decoded.user._id })

  if (!orders) {
    res.json({
      success: false,
      message: "You have not orders",
    });

  } else {


    res.json(orders);
  }

});
router.get("/orders/:id", checkJWT, async (req, res, next) => {
  const orders = await Order.findOne({ _id: req.params.id }).populate('owner').populate('products.product')

  if (!orders) {
    res.json({
      success: false,
      message: "Order Not Exist",
    });

  } else {


    res.json(
      {
        success: true,

        order: orders
      }
    );
  }

});


router.delete("/orders/:id", checkJWT, async (req, res, next) => {
  const orders = await Order.findOneAndDelete({ _id: req.params.id })

  if (!orders) {
    res.json({
      success: false,
      message: "You have not orders",
    });

  } else {


    res.json(
      {
        success: true,

        message: 'Order has been Deleated'
      }
    );
  }

});


router.post("/orders", checkJWT, async (req, res, next) => {


  const [ownerId, products, totalPrice] = req.body;

  const order = new Order({
    owner: ownerId,
    totalPrice: totalPrice,
    products: products.map((product) => ({
      product: product.product,
      quantity: product.quantity,
    }))
  })
  order.save()

  if (order) {


    res.json({
      success: true,
      message: "Order PLACED SUCCESSFULLY......!!!!",
    });


  }


  else {
    res.json({
      success: False,
      message: "Oder NOT Placed",
    });
  }
})




router.get("/address", checkJWT, (req, res, next) => {
  User.findOne({
    _id: req.decoded.user._id
  }, (err, user) => {
    res.json({
      success: true,
      address: user.address,
      message: "Successful",
    });
  });
})

router.post("/address", checkJWT, (req, res, next) => {
  User.findOne({
    _id: req.decoded.user._id
  }, (err, user) => {
    if (err) return next(err);

    if (req.body.addr1) user.address.addr1 = req.body.addr1;
    if (req.body.addr2) user.address.addr2 = req.body.addr2;
    if (req.body.city) user.address.city = req.body.city;
    if (req.body.state) user.address.state = req.body.state;
    if (req.body.country) user.address.country = req.body.country;
    if (req.body.postalCode) user.address.postalCode = req.body.postalCode;

    user.save();
    res.json({
      success: true,
      message: "Address successfully edited",
    });
  });
});





module.exports = router;


