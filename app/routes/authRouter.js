var express = require("express");
const AuthController = require("../controllers/auth/authController");
const OAuthController = require("../controllers/auth/oAuthController");

var router = express.Router();

router.post("/register", AuthController.register);
router.post("/registerasastudent", AuthController.registerAsAstudent);
router.post("/login", AuthController.login);

router.post("/verify-otp", AuthController.verifyConfirm);
router.post("/verify-mobile", AuthController.ifMobileExist);
router.post("/verify-email", AuthController.ifEmailExist);

router.post("/resend-verify-otp", AuthController.resendConfirmOtp);
router.post("/profile/update/:id", AuthController.updateProfile);
router.get("/profile/getmyprofile/:type/:id/", AuthController.getMyProfile);

router.post("/confirm-mobile", AuthController.ConfirmMobileNumber);
router.get("/test-email", AuthController.testEmail);



router.post("/google/", OAuthController.googleAuth);
router.post("/facebook/", OAuthController.facebookAuth);
router.post("/twitter/", OAuthController.facebookAuth);








module.exports = router;