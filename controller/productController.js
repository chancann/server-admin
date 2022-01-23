const Product = require('../model/Product')

exports.getAllproduct = async (req, res) => {
  try {
    const response = await Product.find();
    res.send({
      data: {
        status: 200,
        data: response,
      },
    });
  } catch (error) {
    res.send(error);
  }
}

exports.createProduct = async (req, res, next) => {
  try {
    const product = {
      title: req.body.title,
      category: req.body.category,
      author: req.body.author,
      description: req.body.description,
      price: req.body.price
    };

    const newProduct = new Product(product);
    const response = await newProduct.save();

    if (!response) throw new Error("Failed to create Product");
    res.send({
      status: 200,
      data: "Product created!",
    });
  } catch (error) {
    res.send(error);
  }
  next();
};

exports.updateProduct = async (req, res, next) => {
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

exports.deleteProduct = async (req, res) => {
  const {
    id
  } = req.params;
  try {
    const response = await Product.findByIdAndDelete(id);
    if (response) {
      res.send({
        status: 200,
        data: `product with id: ${id}, deleted`,
      });
    } else {
      res.send({
        status: 400,
        data: `failed to delete product with id ${id}`,
      });
    }
  } catch (error) {
    res.send(error);
  }
};

