var router = require("express").Router();
var controller = require("../controllers/index");

router.get("/", controller.index);
router.get("/register", controller.registerForm);
router.post("/register", controller.register);
router.get("/login", controller.loginForm);
router.post("/login", controller.login);
router.post("/logout");


module.exports = router;