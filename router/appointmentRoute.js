const router = require("express").Router();
const Appointment = require("../model/Appointment");
const nodemailerFunc = require("../utils/nodemailer");

// get all appointment
router.get("/", async (req, res) => {
  try {
    const response = await Appointment.find();
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

// create appointment
router.post("/add", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    const response = await newAppointment.save();

    //** send email
    if (response) {
      const to = response.email;

      const UserAppointmentData = {
        nisn: response.no_nisn,
        nama: response.nama,
        no_telpon: response.no_telpon,
        alamat: response.alamat,
      };

      const subject = "Appointment Verification";
      const link = "adsadasadassad";

      // ** Sending email
      nodemailerFunc(to, UserAppointmentData, subject, link);
    }

    if (!response) throw new Error("Failed to create Appointment");
    res.send({
      status: 200,
      data: "Appointment Created!",
    });
  } catch (error) {
    res.send(error);
  }
});

// get Appointment details
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Appointment.findById(id);

    if (response) {
      res.send({
        status: 200,
        data: response,
      });
    } else {
      res.send({
        status: 404,
        data: `Failed to get Appointment with id ${id}`,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

// Update Appointment
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Appointment.findByIdAndUpdate(id, req.body);
    if (response) {
      res.send({
        status: 200,
        data: "Success",
      });
    } else {
      res.send({
        status: 404,
        data: `Failed Update Appointment with id: ${id}`,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

// delete Appointment
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Appointment.findByIdAndDelete(id);
    if (response) {
      res.send({
        status: 200,
        data: `Appointment with id: ${id}, deleted`,
      });
    } else {
      res.send({
        status: 400,
        data: `Failed to delete Appointment with id ${id}`,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
