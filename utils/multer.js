const multer = require("multer");

// multer config
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.originalname);
  },
});

// multer file filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || "image/jpg" || "image/jpeg") {
    cb(null, true);
  } else {
    cb("File type is not allowed", false);
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter,
  limits: "30mb",
});

module.exports = upload;
