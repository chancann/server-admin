const JWT = require("jsonwebtoken");

module.exports = {
  isLoggedIn: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        JWT.verify(authHeader, process.env.JWT_SEC, (err, data) => {
          if (err) {
            return res.status(403).send({ status: 403, data: "Invalid Token" });
          }
          req.user = data;
          next();
        });
      } else {
        res.send({
          status: 402,
          data: "Login Required",
        });
      }
    } catch (error) {
      res.send(error);
    }
  },

  requireAdmin: async (req, res, next) => {
    try {
      const user = req.user;
      if (user.role === "admin") {
        next();
      } else {
        return res.send({
          status: 403,
          data: "Request Forbidden",
        });
      }
    } catch (error) {
      res.send(error);
    }
  },
};
