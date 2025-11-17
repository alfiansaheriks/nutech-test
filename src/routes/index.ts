import express from "express";
import { TransactionController, ServiceController, UserController } from "../controllers/index.js";
import { validate } from "../middleware/validate.js";
import { validateRegister, validateLogin, validateUpdate, validateTopup, validatePayment } from "../validations/index.js";
import { auth } from "../middleware/auth.js";
import { multerErrorHandler, upload } from "../middleware/upload.js";
import { BannerController } from "../controllers/banner/banners.controller.js";

const router = express.Router();
const userController = new UserController();
const bannerController = new BannerController();
const serviceController = new ServiceController();
const transactionController = new TransactionController();

// Membership Module
router.post("/registration", validate(validateRegister), userController.register.bind(userController));
router.post("/login", validate(validateLogin), userController.login.bind(userController));
router.get("/profile", auth, userController.profile.bind(userController));
router.put("/profile/update", auth, validate(validateUpdate), userController.update.bind(userController));
router.put("/profile/image", auth, upload, multerErrorHandler, userController.updateImage.bind(userController));

// Banner Module
router.get("/banners", bannerController.getBanners.bind(bannerController));
router.get("/services", auth, serviceController.getAllServices.bind(serviceController));

// Transaction Module
router.get("/balance", auth, transactionController.getBalance.bind(transactionController));
router.post("/topup", auth, validate(validateTopup), transactionController.topupBalance.bind(transactionController));
router.post("/transaction", auth, validate(validatePayment), transactionController.payment.bind(transactionController));
router.get("/transaction/history", auth, transactionController.transactionHistory.bind(transactionController));

export default router;
