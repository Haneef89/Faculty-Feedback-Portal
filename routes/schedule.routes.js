import scheduleController from "../controllers/schedule.controller.js";
import express from "express";


const router = express.Router();

router.route("/schedule/add")
    .post(scheduleController.addToSchedule);

router.route("/schedule/delete/:id")
    .get(scheduleController.deleteSchedule);

export default router;