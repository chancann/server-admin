const router = require("express").Router();
const User = require("../model/User");
const Product = require("../model/Product");
const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");
const upload = require("../utils/multer");
const deleteImage = require("../utils/deleteImage");
const { isLoggedIn, requireAdmin } = require("../middleware/auth");
const nodemailerFunc = require("../utils/nodemailer");

// get all user
router.get("/", async (req, res) => {
  const { sort } = req.query;
  try {
    let response = await User.find({ is_deleted: false, is_verified: true });

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

// forget password
router.put("/forget", async (req, res) => {
  try {
    // ** find user
    const isUser = await User.findOne({ email: req.body.email });
    // ** user not found
    if (!isUser) res.send({ status: 404, data: "user not found" });

    // ** check if user send new image
    if (isUser) {
      var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var passwordLength = 12;
      let generatePass = "";

      for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        generatePass += chars.substring(randomNumber, randomNumber + 1);
      }

      const encryptPassword = CryptoJS.AES.encrypt(generatePass, process.env.CRYPTO_SEC).toString();
      const response = await User.findByIdAndUpdate(isUser._id, { password: encryptPassword }, { new: true });
      nodemailerFunc(req.body.email, generatePass, "Kecamatan Sepatan - Reset Password");

      console.log(generatePass);
      if (response) {
        res.send({
          status: 200,
          data: "Please check your email",
        });
      } else {
        res.send({
          status: 400,
          data: `failed to reset user`,
        });
      }
    }
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

    const token = JWT.sign({ _id: user._id, email: user.email, nama: user.nama_lengkap, role: user.role }, process.env.JWT_SEC, { expiresIn: "3d" });
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

// fixup
// update verified to true
router.post("/verify/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await User.findByIdAndUpdate(id, { is_verified: true }, { new: true });
    if (response) {
      res.send({
        status: 200,
        data: "verified!",
      });
    } else {
      res.send({
        status: 400,
        data: `failed to verifiy user`,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

router.get("/request", async (req, res) => {
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

// get detail user by id
router.get("/details/:id", async (req, res) => {
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

// get updateUser
router.put("/update/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  try {
    // ** find product
    const isUser = await User.findById(id);

    // ** product not found
    if (!isUser) res.send({ status: 404, data: "user not found" });

    // ** check if user send new image
    if (req.file) {
      req.body.image = req.file.path;
    }

    if (req.body.password !== isUser.password) {
      const newPassword = CryptoJS.AES.encrypt(req.body.password, process.env.CRYPTO_SEC).toString();
      req.body.password = newPassword;
    }

    const response = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (response) {
      res.send({
        status: 200,
        data: response,
      });
    } else {
      res.send({
        status: 400,
        data: `failed to update user`,
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
    const deletedProduct = await Product.deleteMany({ author: id });
    if (deletedProduct) {
      const response = await User.findByIdAndDelete(id);
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
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
