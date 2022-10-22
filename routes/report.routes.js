import express from 'express';

import reportController from '../controllers/report.controller.js';

const router = express.Router();

router.route("/reports")
    .get(reportController.reports);

router.route("/reports/cr/:branch/:year/:sem/:section/:date")
    .get(reportController.generateConsolidatoryReport);

router.route("/reports/:branch/:year/:sem/:section")
    .get(reportController.getdates);

router.route("/reports/get/:id")
    .get(reportController.getSubjectReport);

export default router;