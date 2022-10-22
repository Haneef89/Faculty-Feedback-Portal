import express from "express";

import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.route('/auth/register/student/')
    .post(authController.registerStudent);

router.route("/auth/register/admin/")
    .post(authController.registerAdmin);

router.route("/auth/signin")
    .post(authController.signin);

router.route("/auth/logout")
    .get(authController.logout);

export default router;