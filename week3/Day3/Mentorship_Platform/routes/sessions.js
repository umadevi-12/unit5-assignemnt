const express = require("express");
const c = require("../controllers/sessionController");
const router = express.Router();

router.post("/", c.createSession);
router.get("/mentor/:id", c.getActiveSessionsForMentor);
router.get("/learner/:id", c.getActiveSessionsForLearner);
router.get("/recent", c.recentSessions);
router.get("/mentor/:id/learners/count", c.countLearnersForMentor); 
router.get("/:id/learners", c.listLearnersForSession);
router.get("/learners/more-than", c.findLearnersWithMoreThanNSessions); 
router.post("/:id/archive", c.archiveSession);

module.exports = router;
