const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nik: String,
    nama_lengkap: String,
    email: String,
    password: String,
    alamat: String,
    jenis_kelamin: {
      type: String,
      enum: ["Laki-laki", "Perempuan"],
    },
    no_hp: Number,
    image: String,
    role: {
      type: String,
      default: "user",
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
