const router = require("express").Router();

// Require Controller
const userController = require('../controller/userController')

router.get("/", userController.getAllUser);

router.post("/add", userController.createUser);

router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

module.exports = router;