import express from "express"
import { forgotPassword, getUserProfile, login, logout, register, resetPassword, updateProfile } from "../controller/user.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import upload from "../utils/multer.js"

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/login/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").post(resetPassword)
router.route("/logout").get(logout)
router.route("/profile").get( isAuthenticated, getUserProfile)
router.route("/profile/update").put( isAuthenticated,upload.single("profilePhoto"), updateProfile)

export default router;