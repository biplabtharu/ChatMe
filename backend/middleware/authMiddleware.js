import jwt from "jsonwebtoken";
import USER from "../models/userSchema.js";

const authMiddleware = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    console.log(req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    if (!token) {
      res.json("token not available");
      console.log("token not availabe");
      next();
    } else {
      try {
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(decodedUser.data._id);

        req.user = await USER.findById({ _id: decodedUser.data._id }).select(
          "-password"
        );
        // console.log(`req.user ${req.user}`);
        next();
      } catch (err) {
        console.log(`auth middleware error ${err}`);
        res.status(401).json(`auth middleware error ${err}`);
        next();
      }
    }
  } else {
    res.json(`no headers`);
    console.log("no headers");
    next();
  }
};

export { authMiddleware };
