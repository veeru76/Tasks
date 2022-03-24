const jwtConfig = require("../jwt");

const authChecker = async (req, res, next) => {
  try {
    if (req.headers.hasOwnProperty("authorization")) {
      if (!req.headers.authorization.includes("Bearer ")) {
        res.status(401).json({
          error: {
            type: "UNAUTHORIZED",
            sub_type: "AUTHENTICATION_TYPE",
            message: "Authentication type is not allowed",
          },
        });
        return;
      }
    }
    const token = req.headers.authorization.replace('Bearer ', '');
    const jwtData = await jwtConfig.verify(token);
    if (jwtData.isValid && !jwtData.isExpired) {
      res.locals.payload = jwtData.payload;
      next();
    } else if (!jwtData.isValid) {
      res.status(400).json({
        error: {
          type: "BAD_REQUEST",
          sub_type: "INVALID_ACCESS_TOKEN",
          message: "Invalid access token",
        },
      });
    } else if (jwtData.isExpired) {
      res.status(401).json({
        error: {
          type: "UNAUTHORIZED",
          sub_type: "EXPIRED_ACCESS_TOKEN",
          message: "Expired access token",
        },
      });
    } else {
      res.status(401).json({
        error: {
          type: "UNAUTHORIZED",
          sub_type: "MISSING_ACCESS_TOKEN",
          message: `access token is not present in headers. Please use 'authorization' in headers key`,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {authChecker : authChecker};