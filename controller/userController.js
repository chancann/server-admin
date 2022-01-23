const User = require("../model/User");
const CryptoJS = require("crypto-js");

exports.getAllUser = async (req, res) => {
  try {
    const response = await User.find();
    res.send({
      data: {
        status: 200,
        data: response,
      },
    });
  } catch (error) {
    res.send(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    // check if user email already register
    const isEmailExist = await User.findOne({
      email: req.body.email
    });
    if (isEmailExist) {
      res.send({
        status: 400,
        data: "Email Exist!",
      });
      return;
    }

    // hash user password and give default role
    const user = {
      nik: req.body.nik,
      nama_lengkap: req.body.nama_lengkap,
      // username:req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(req.body.password, process.env.CRYPTO_SEC).toString(),
      alamat: req.body.alamat,
      no_hp: req.body.no_hp,
      image: req.body.image,
    };

    const newUser = new User(user);
    const response = await newUser.save();

    if (!response) throw new Error("Failed to create user");
    res.send({
      status: 200,
      data: "User created!",
    });
  } catch (error) {
    res.send(error);
  }
  next();
};

exports.updateUser = async (req, res, next) => {
  try {
    const response = await User.find();
    res.send({
      data: {
        status: 400,
        data: "User Updated!",
      },
    });
  } catch (error) {
    res.send(error);
  }
};

exports.deleteUser = async (req, res) => {
  const {
    id
  } = req.params;
  try {
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
  } catch (error) {
    res.send(error);
  }
};