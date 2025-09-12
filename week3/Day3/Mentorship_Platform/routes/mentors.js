const express = require("express");
const c = require("../controllers/mentorController");
const router = express.Router();

router.post("/", c.createMentor); 
router.get("/no-active-sessions", c.getMentorsWithNoActiveSessions);
router.get("/:id", c.getMentor);
router.delete("/:id", c.softDeleteMentor);

module.exports = router;
