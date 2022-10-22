import Subject from "../models/subject.model.js";
import Schedule from "../models/schedule.model.js";
import Feedback from "../models/feedback.model.js";
import User from "../models/user.model.js";
import dbErrorHandler from "../helpers/dbErrorHandler.js";
import moment from "moment";

const sendForm = async (req, res) => {
    if (req.user && req.user.verified && req.user.role == "student" && !req.user.feedback) {
        let subjects = await Subject.find({
            year: req.user.year,
            sem: req.user.sem,
            branch: req.user.branch,
            section: req.user.section
        });
        let schedule = await Schedule.findOne({
            year: req.user.year,
            sem: req.user.sem,
            branch: req.user.branch,
            section: req.user.section
        });
        let sd = new Date(moment(schedule.date).format('YYYY-MM-DD'));
        let today = new Date();
        let nextDay = new Date(sd);
        nextDay.setDate(sd.getDate() + 1);
        if (today.getTime() >= sd.getTime() && today.getTime() < nextDay.getTime()) {
            res.status(200).render("form", {
                user: req.user,
                subjects: subjects
            });
        } else {
            res.redirect("/");
        }
    } else {
        res.redirect("/");
    }
}

const deleteAllFeedbackData = async (req, res) => {
    if (req.user && req.user.verified && req.user.role == "admin") {
        let branch = req.params.branch;
        let sem = req.params.sem;
        let year = req.params.year;
        let section = req.params.section;
        try {
            await Feedback.deleteMany({branch: branch, year: year, sem: sem, section: section});
            await User.updateMany({branch: branch, year: year, sem: sem, section: section, role: "student"}, {feedback: false});
            return res.status(200).json({
                message: "Successfully Deleted All Feedback Data",
                status: "success"
            });
        } catch (error) {
            return res.status(200).json({
                message: dbErrorHandler.getErrorMessage(error),
                status: "error"
            });
        }
    } else {
        return res.status(200).json({
            message: 'You are ot allowed to perform this Operation',
            status: "error"
        });
    }
}

const saveFormData = async (req, res) => {
    if (req.user && req.user.verified && req.user.role == "student" && !req.user.feedback) {
        let course_id = Array.isArray(req.body.course_id) ? req.body.course_id : [req.body.course_id];
        let subs = Array.isArray(req.body.name) ? req.body.name : [req.body.name];
        let subjects = {};
        course_id.forEach((key, i) => subjects[key] = subs[i]);
        try {
            for (var subject in subjects) {
                let data = {
                    rollno: req.user.rollno,
                    branch: req.user.branch,
                    year: req.user.year,
                    sem: req.user.sem,
                    section: req.user.section,
                    date: moment(new Date()).format('YYYY-MM-DD'),
                    name: subjects[subject],
                    course_id: subject,
                    tc: req.body["tc" + subject],
                    exd: req.body["exd" + subject],
                    sk: req.body["sk" + subject],
                    otsc: req.body["otsc" + subject],
                    punc: req.body["punc" + subject],
                    amim: req.body["amim" + subject],
                    ab: req.body["ab" + subject]
                };
                await Feedback.findOneAndUpdate({
                    rollno: data.rollno,
                    course_id: data.course_id
                }, data, {
                    upsert: true
                });
            }
            await User.findOneAndUpdate({
                _id: req.user._id
            }, {
                feedback: true
            }, {
                new: true
            });
        } catch (err) {
            return res.status(200).json({
                message: errorHandler.getErrorMessage(error),
                status: "error"
            });
        }
        res.redirect("/");
    } else {
        res.redirect("/");
    }
}


export default {
    sendForm,
    saveFormData,
    deleteAllFeedbackData
};