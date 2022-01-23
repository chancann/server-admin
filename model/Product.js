const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const Product = mongoose.Schema(
  {
    title: String,
    description: String,
    bed_room: Number,
    bath_room: Number,
    building_area: Number,
    carport: Number,
    maps: String,
    images: [{ data: String }],
    slug: { type: String, slug: ["title"], unique: true },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", Product);
