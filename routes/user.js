var router = require("express").Router();
var controller = require("../controllers/user");

router.get("/user/new", controller.new);
router.get("/user/:id", controller.get);
router.post("/user", controller.create);

module.exports = router;