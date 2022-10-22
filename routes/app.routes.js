import express from "express";
import initService from "../services/init.service.js";

const router = express.Router();

router.route("/")
    .get(initService.homeRoute);

router.route("/dashboard")
    .get(initService.dashboard);

router.route("/addadmin")
    .get(initService.createAdmin);

router.route("/settings")
    .get(initService.settings);

router.route("/subjects")
    .get(initService.subjects);

export default router;