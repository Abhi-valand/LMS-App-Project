import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createCheckoutSession as createRazorpayOrder, getAllPurchasedCourse, getCourseDetailWithPurchaseStatus, razorpayWebhook } from "../controller/coursePurchase.controller.js";

const router = express.Router();

router.route("/razorpay/webhook").post(express.json(), razorpayWebhook);
router.route("/razorpay/order").post(isAuthenticated, createRazorpayOrder);
router.route("/course/:courseId/detail-with-status").get(isAuthenticated,getCourseDetailWithPurchaseStatus);
router.route("/").get(isAuthenticated,getAllPurchasedCourse);

export default router;