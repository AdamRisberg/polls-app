var router = require("express").Router();
var controller = require("../controllers/index");

router.get("/", controller.index);
router.get("/register", controller.registerForm);
router.post("/register", controller.register);
router.get("/login", controller.loginForm);
router.post("/login", controller.login);
router.get("/logout", controller.logout);
router.get("/user/:id", controller.user);


module.exports = router;