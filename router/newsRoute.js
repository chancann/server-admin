const router = require("express").Router();
const News = require("../model/News");
const { isLoggedIn, requireAdmin } = require("../middleware/auth");
const upload = require("../utils/multer");
const deleteImage = require("../utils/deleteImage");

// get all News
router.get("/", async (req, res) => {
  try {
    const response = await News.find({ is_deleted: false });
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

// create News
router.post("/add", isLoggedIn, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    // ** when when user upload image req.body will hiject
    if (req.file) {
      req.body.image = req.file.path;
    }

    const newNews = new News(req.body);
    const response = await newNews.save();

    if (!response) throw new Error("Failed To Create News");
    res.send({
      status: 200,
      data: "News Created!",
    });
  } catch (error) {
    res.send(error);
  }
});

// get detail news
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    //** finding News in database
    const response = await News.findById(id);

    // ** News response
    if (response) {
      res.send({
        status: 200,
        data: response,
      });
    } else {
      res.send({
        status: 404,
        data: `Failed to get News with id ${id}`,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

// update News
router.put("/:id", isLoggedIn, requireAdmin, upload.single("image"), async (req, res) => {
  const { id } = req.params;
  try {
    // ** find News
    const isNewsExist = await News.findById(id);

    // ** News not found
    if (!isNewsExist) res.send({ status: 404, data: "News not found" });

    // ** check if user send new image
    if (req.file) {
      // ** check product already have an image
      if (isNewsExist.image) {
        deleteImage(isNewsExist.image);
      }

      //** hijct req.body
      req.body.image = req.file.path;
    }

    const response = await News.findByIdAndUpdate(id, req.body);

    if (response) {
      res.send({
        status: 200,
        data: response,
      });
    } else {
      res.send({
        status: 404,
        data: `Failed to Update News with id ${id}`,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

// delete News
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await News.findByIdAndDelete(id);
    if (response) {
      res.send({
        status: 200,
        data: `News with id: ${id}, deleted`,
      });
    } else {
      res.send({
        status: 400,
        data: `Failed to delete News with id ${id}`,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
