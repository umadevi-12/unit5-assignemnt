const express = require("express");
const c = require("../controllers/learnerController");
const router = express.Router();

router.post("/", c.createLearner);
router.delete("/:id", c.softDeleteLearner);
router.get("/:id/mentors", c.listMentorsForLearner);

module.exports = router;
