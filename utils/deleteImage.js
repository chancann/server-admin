const fs = require("fs");
const path = require("path");
const rootPath = path.resolve();

const deleteImage = (filepath) => {
  filepath = path.join(rootPath, filepath);
  fs.unlink(filepath, (err) => console.log(err));
};

module.exports = deleteImage;
