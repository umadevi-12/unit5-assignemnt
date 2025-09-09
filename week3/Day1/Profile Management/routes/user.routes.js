const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/add-user", userController.addUser);
router.post("/add-profile/:userId", userController.addProfile);
router.get("/get-users", userController.getUsers);
router.get("/search", userController.search);
router.put("/update-profile/:userId/:profileName", userController.updateProfile);
router.delete("/delete-profile/:userId/:profileName", userController.deleteProfile);

module.exports = router;
