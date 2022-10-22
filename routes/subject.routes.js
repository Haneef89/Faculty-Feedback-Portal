import subjectsController from "../controllers/subjects.controller.js";
import express from "express";


const router = express.Router();

router.route("/subjects/add")
    .post(subjectsController.addSubject);

router.route("/subjects/get/:branch/:year/:sem")
    .get(subjectsController.getSubject);

router.route("/subjects/delete/:id")
    .get(subjectsController.deleteSubject);

export default router;