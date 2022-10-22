import User from '../models/user.model.js';
import Schedule from "../models/schedule.model.js";
import errorHandler from '../helpers/dbErrorHandler.js';

const createAdmin = async (req, res) => {
    if (req.user && req.user.role == "admin" && req.user.verified) {
        res.status(200).render("admin-signup");
    }
}

const homeRoute = async (req, res) => {

    if (!init) {
        try {
            let count = await User.count();
            if (count == 0) {
                res.status(200).render("admin-signup");
            } else {
                global.init = true;
                res.redirect("/");
            }
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
    } else if (req.user) {
        res.redirect("/dashboard");
    } else {
        res.status(200).render("signin");
    }
}

const dashboard = async (req, res) => {
    if (req.user && req.user.verified) {
        if (req.user.role == "admin") {
            let users = await User.find({
                role: "mentor",
                branch: req.user.branch
            });
            let schedule = await Schedule.find();
            res.render("admin-dashboard", {
                users: users,
                user: req.user,
                schedule: schedule
            });
        } else if (req.user.role == "mentor") {
            let users = await User.find({
                role: "student",
                branch: req.user.branch,
                year: req.user.year,
                sem: req.user.sem,
                section: req.user.section
            });
            res.render("mentor-dashboard", {
                users: users,
                user: req.user
            });
        } else if (req.user.role == "student") {
            let schedule = await Schedule.findOne({
                branch: req.user.branch,
                year: req.user.year,
                sem: req.user.sem,
                section: req.user.section
            })
            res.render("student-dashboard", {
                user: req.user,
                schedule: schedule
            });
        }
    } else {
        res.redirect("/");
    }
}

const settings = async (req, res) => {
    if (req.user) {
        let user = req.user;
        user.password = null;
        res.render("settings", {
            user: user
        });
    } else {
        res.redirect("/");
    }
}

const subjects = async (req, res) => {
    if (req.user && req.user.verified && req.user.role == "admin") {
        let users = await User.find({
            role: {
                $in: ['admin', 'mentor']
            }
        });
        let schedule = await Schedule.find();
        res.render("subjects", {
            user: req.user,
            users: users,
            subjects: []
        });
    } else {
        res.redirect("/");
    }
}

export default {
    homeRoute,
    dashboard,
    settings,
    subjects,
    createAdmin
};