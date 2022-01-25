const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    description: String,
    price: String,
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
