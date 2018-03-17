var router = require("express").Router();
var controller = require("../controllers/poll");

router.post("/", controller.create);
router.get("/", controller.new);
router.get("/:id", controller.get);
router.delete("/:id", controller.delete);

module.exports = router;