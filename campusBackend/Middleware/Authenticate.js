const Requests = require('../Models/ModuleRequests');
const jwt = require('jsonwebtoken');
const Authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.token;
    console.log(authHeader);
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

      const rootUser = await Requests.findOne({
        _id: verifyToken._id,
        'tokens.token': token,
      });
      if (!rootUser) {
        throw new Error('user not found');
      }
      req.token = token;
      req.rootUser = rootUser;
      req.userID = rootUser._id;

      next();
    }
  } catch (err) {
    res.status(401).send('Unauthorized: no Token Provided');
    console.log(err);
  }
};
module.exports = Authenticate;
