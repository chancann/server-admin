const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    image: [{data: String}],
    title: String,
    category: String,
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
