const router = require("express").Router();
const Product = require("../model/Product");
const { isLoggedIn, requireAdmin } = require("../middleware/auth");
const upload = require("../utils/multer");
const deleteImage = require("../utils/deleteImage");

// get all Products
router.get("/", async (req, res) => {
  try {
    const response = await Product.find({ is_deleted: false }).populate("author");
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

// create Product
router.post("/add", upload.array("images"), async (req, res) => {
  try {
    // ** when when user upload image req.body will hiject
    if (req.files) {
      let filesPath = [];

      req.files.map((file) => {
        filesPath.push({ data: file.path });
      });

      req.body.images = filesPath;
    }

    const newProduct = new Product(req.body);
    const response = await newProduct.save();

    if (!response) throw new Error("Failed To Create Product");
    res.send({
      status: 200,
      data: "Product Created!",
    });
  } catch (error) {
    res.send(error);
  }
});

// get detail product
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    //** finding Product in database
    const response = await Product.findById(id).populate("author");

    // ** Product response
    if (response) {
      res.send({
        status: 200,
        data: response,
      });
    } else {
      res.send({
        status: 404,
        data: `Failed to get Product with id ${id}`,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

router.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Product.find({ author: id }).populate("author");

    if (response) {
      res.send({
        status: 200,
        data: response,
      });
    } else {
      res.send({
        status: 404,
        data: `Failed to Update Product with id ${id}`,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

// update product
router.put("/:id", upload.array("images"), async (req, res) => {
  const { id } = req.params;
  try {
    // ** find product
    const isProductExist = await Product.findById(id);

    // ** product not found
    if (!isProductExist) res.send({ status: 404, data: "Product not found" });

    // ** check if user send new image
    if (req.files) {
      if (isProductExist.images.length) {
        isProductExist.images.map((image) => {
          deleteImage(image.data);
        });
      }

      let filesPath = [];
      req.files.map((file) => {
        filesPath.push({ data: file.path });
      });
      req.body.images = filesPath;
    }

    const response = await Product.findByIdAndUpdate(id, req.body, { new: true });

    if (response) {
      res.send({
        status: 200,
        data: response,
      });
    } else {
      res.send({
        status: 404,
        data: `Failed to Update Product with id ${id}`,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

// delete products
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);

    // ** check if product have images
    if (product && product.images.length) {
      product.images.map((image) => {
        deleteImage(image.data);
      });
    }

    const response = await Product.findByIdAndDelete(id);

    if (response) {
      res.send({
        status: 200,
        data: `Product with id: ${id}, deleted`,
      });
    } else {
      res.send({
        status: 400,
        data: `Failed to delete Product with id ${id}`,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
