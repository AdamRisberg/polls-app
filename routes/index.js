var router = require("express").Router();
var controller = require("../controllers");

router.get("/", controller.index);

router.get("/poll/new", controller.newPoll);
router.get("/poll/:id", controller.poll);
router.post("/poll", controller.createPoll);
router.delete("/poll/:id", controller.deletePoll);

router.get("/user/new", controller.newUser);
router.get("/user/:id", controller.user);
router.post("/user", controller.createUser);

router.get("/account/:id", controller.account);

module.exports = router;