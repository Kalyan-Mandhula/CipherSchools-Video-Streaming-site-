const createError = require("../Error");
const JWT = require("jsonwebtoken");

const CheckLogin = async (req, res, next) => {
  try {
    let token = req.cookies.access_token;

    if (!token) {
      return next(createError(500, "You need to login first"));
    }

    JWT.verify(token, process.env.JWT_STRING, (err, user) => {
      if (err) {
        return next(createError(500, "Token is invalid"));
      }

      req.user = user;
      next();
    });
  } catch (err) {
    next(err);
  }
};

module.exports = CheckLogin
