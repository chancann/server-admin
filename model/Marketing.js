const mongoose = require("mongoose");

const AppointmentSchema = mongoose.Schema(
  {
    name: String,
    no_whatsapp: Number,
    email: String,
    status: {
      type: String,
      enum: ["failed", "pending", "success"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
