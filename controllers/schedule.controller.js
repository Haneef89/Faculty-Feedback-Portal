import Schedule from "../models/schedule.model.js";

const addToSchedule = async (req, res) => {
    if (req.user && req.user.verified && req.user.role == "admin") {
        try {
            let sd = await Schedule.findOne({
                branch: req.body.branch,
                year: req.body.year,
                sem: req.body.sem,
                section: req.body.section
            });
            if (sd) {
                res.status(200).json({
                    message: "Already Scheduled! Please delete previous scheduled data and try again!",
                    status: "error"
                });
            } else {
                let schedule = new Schedule(req.body);
                await schedule.save();
                res.status(200).json({
                    message: "Scheduled successfully!",
                    status: "success"
                });
            }
        } catch (error) {
            return res.status(400).json({
                message: errorHandler.getErrorMessage(error),
                status: "error"
            });
        }
    }
}

const deleteSchedule = async (req, res) => {
    if (req.user && req.user.verified && req.user.role == "admin") {
        let id = req.params.id;
        try {
            await Schedule.deleteOne({
                _id: id
            });
            return res.status(200).json({
                message: `Successfully deleted`,
                status: "success"
            });
        } catch (error) {
            return res.status(400).json({
                message: errorHandler.getErrorMessage(error),
                status: "error"
            });
        }
    }
}

export default {
    addToSchedule,
    deleteSchedule
};