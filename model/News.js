const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const NewsSchema = mongoose.Schema(
  {
    title: String,
    body: String,
    image: String,
    slug: { type: String, slug: ["title"], unique: true },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", NewsSchema);
