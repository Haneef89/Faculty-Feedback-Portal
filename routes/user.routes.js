import express from "express";

import userController from "../controllers/user.controller.js";

const router = express.Router();

router.route("/update")
    .post(userController.updateSelf);

router.route("/add-users")
    .post(userController.addUsers);

router.route("/delete-user/:id")
    .get(userController.deleteUser);

router.route("/verify-user/:id")
    .get(userController.verifyUser);

router.route("/edit-user/:id")
    .get(userController.editUser);

router.route("/update-user")
    .post(userController.updateUser);

router.route("/delete-all")
    .get(userController.deleteAll);

router.route("/verify-all")
    .get(userController.verifyAll);

router.route("/clear-feedback-status")
    .get(userController.clearFeedbackStatus);

router.route("/signup")
    .post(userController.signup);

export default router;