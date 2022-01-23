const mongoose = require("mongoose");

const AppointmentSchema = mongoose.Schema(
  {
    name: String,
    marketing_name: String,
    no_whatsapp: Number,
    email: String,
    appointment_date: Date,
    is_verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["failed", "pending", "success"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
