import express from "express";

import feedbackController from '../controllers/feedback.controller.js';

const router = express.Router();

router.route("/feedback/form")
    .get(feedbackController.sendForm);

router.route("/feedback/save/")
    .post(feedbackController.saveFormData);

router.route("/feedback/delete/:year/:sem/:branch/:section")
    .get(feedbackController.deleteAllFeedbackData);

export default router;