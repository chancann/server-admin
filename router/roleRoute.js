const router = require("express").Router();
const Role = require("../model/Role");

// get all Role
router.get("/", async (req, res) => {
  try {
    const response = await Role.find();
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

// create Role
router.post("/add", async (req, res) => {
  try {
    const newRole = new Role(req.body);
    const response = await newRole.save();

    if (!response) throw new Error("Failed to create Role");
    res.send({
      status: 200,
      data: "Role Created!",
    });
  } catch (error) {
    res.send(error);
  }
});

// get Role details
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Role.findById(id);

    if (response) {
      res.send({
        status: 200,
        data: response,
      });
    } else {
      res.send({
        status: 404,
        data: `Failed to get Role with id ${id}`,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

// Update Role
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Role.findByIdAndUpdate(id, req.body);
    if (response) {
      res.send({
        status: 200,
        data: "Success",
      });
    } else {
      res.send({
        status: 404,
        data: `Failed Update Role with id: ${id}`,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

// delete Role
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Role.findByIdAndDelete(id);
    if (response) {
      res.send({
        status: 200,
        data: `Role with id: ${id}, deleted`,
      });
    } else {
      res.send({
        status: 400,
        data: `Failed to delete Role with id ${id}`,
      });
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
