//Middle ware file using JSON Web Token for authentication 
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.headers["authorization"];

if (token) { 
  const secretKey = 'myecomm';

  const decoded = jwt.verify(token, secretKey )
      
  if(decoded){
    req.decoded = decoded; 
      next();

  }
} else {
  res.status(403).json({
    success: false, 
    message: 'No token provided' 
  });
}

}





