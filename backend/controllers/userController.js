import USER from "../models/userSchema.js";

const userSignup = async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400).json(`All fields are required`);
  }

  try {
    const userExists = await USER.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: `user already present` });
      console.log(`user already present`);
      // throw new Error(`User already present`);
    } else {
      const createUser = new USER({
        name,
        email,
        password,
        pic,
      });

      const user = await createUser.save();

      if (user) {
        console.log(user);
        res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
          token: await user.generateToken(user),
        });
      } else {
        console.log(`user registration error`);
        res.status(400).json({ message: `user registration error` });
      }
    }
  } catch (err) {
    console.log(`user registration error ${err}`);
    res.status(400).json(err);
  }
};

const userSignin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("all fields are required");
    res.status(400).json(`All fields are required`);
  }

  try {
    const userExists = await USER.findOne({ email });
    if (!userExists) {
      res.status(400).json({ message: `user doesnot exists` });
      console.log(`user doesnot exists`);
      // throw new Error(`user doesnot exists`);
    } else {
      const passwordMatch = await userExists.matchPassword(password);

      if (passwordMatch) {
        res.status(200).json({
          _id: userExists._id,
          name: userExists.name,
          email: userExists.email,
          pic: userExists.pic,
          token: await userExists.generateToken(userExists),
        });
        console.log(`login successfull`);
      } else {
        res.status(400).json({ message: `login failed` });
        console.log(`login failed`);
      }
    }
  } catch (err) {
    console.log(`user signin error ${err}`);
    res.status(400).json({ message: `user signin error ${err}` });
  }
};

const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search } },
          { email: { $regex: req.query.search } },
        ],
      }
    : {};

  try {
    const users = await USER.find(keyword).find({ _id: { $ne: req.user._id } });
    // console.log(users);
    // res.json(`keyword is ${keyword}`);
    // res.json(keyword);
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};

export { userSignup, userSignin, allUsers };
