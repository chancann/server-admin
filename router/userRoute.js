const router = require("express").Router();
const User = require("../model/User");
const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");
const { isLoggedIn, requireAdmin } = require("../middleware/auth");

// get all user
router.get("/", async (req, res) => {
  const { sort } = req.query;
  try {
    let response = await User.find({ is_deleted: false });

    // query
    if (sort === "asc") {
      response = await User.find({ is_deleted: false }).sort({ createdAt: "asc" });
    }
    if (sort === "desc") {
      response = await User.find({ is_deleted: false }).sort({ createdAt: "desc" });
    }

    // response
    res.send({
      data: {
        status: 200,
        data: response,
      },
    });
  } catch (error) {
    res.send(error);
  }
});

// create user
router.post("/add", async (req, res) => {
  try {
    // check if user email already register
    const isEmailExist = await User.findOne({ email: req.body.email, is_deleted: false });
    if (isEmailExist) {
      res.send({
        status: 400,
        data: "Email Exist!",
      });
      return;
    }

    // hash user password and give default role
    // const user = {
    //   email: req.body.email,
    //   username: req.body.username,
    //   password: ,
    //   role: "user",
    // };

    const newUser = new User({ ...req.body, password: CryptoJS.AES.encrypt(req.body.password, process.env.CRYPTO_SEC).toString() });
    const response = await newUser.save();
    if (!response) throw new Error("Failed to create user");

    // response
    res.send({
      status: 200,
      data: "User created!",
    });
  } catch (error) {
    res.send(error);
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // user not found
    if (!user) {
      res.send({
        status: 404,
        data: "User not found!",
      });
      return;
    }

    // decrypt
    const decryptPassword = CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_SEC);
    const userPassword = decryptPassword.toString(CryptoJS.enc.Utf8);

    // response if password not match
    if (userPassword !== req.body.password) {
      res.send({
        status: 402,
        data: "Wrong credentials",
      });
      return;
    }

    const token = JWT.sign({ _id: user._id, email: user.email, username: user.username, role: user.role }, process.env.JWT_SEC, { expiresIn: "3d" });
    res.send({
      status: 200,
      data: {
        ...user._doc,
        token,
      },
    });
  } catch (error) {
    res.send(error);
  }
});

router.get("/request", isLoggedIn, requireAdmin, async (req, res) => {
  try {
    const response = await User.find({ is_verified: false });
    if (response) {
      res.send({
        status: 200,
        data: response,
      });
    } else {
      res.send({
        status: 400,
        data: `failed to get user`,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

router.get("/request", isLoggedIn, requireAdmin, async (req, res) => {
  try {
    const response = await User.find({ is_verified: true });
    if (response) {
      res.send({
        status: 200,
        data: response,
      });
    } else {
      res.send({
        status: 400,
        data: `failed to get user`,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

// get detail user by id
router.get("/details/:id", isLoggedIn, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const response = await User.findOne({ _id: id });
    if (response) {
      res.send({
        status: 200,
        data: response,
      });
    } else {
      res.send({
        status: 400,
        data: `failed to get user`,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

// delete user by id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await User.findByIdAndUpdate(id, { is_deleted: true });
    if (response) {
      res.send({
        status: 200,
        data: `user with id: ${id}, deleted`,
      });
    } else {
      res.send({
        status: 400,
        data: `failed to delete user with id ${id}`,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
