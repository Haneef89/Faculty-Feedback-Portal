import Subject from "../models/subject.model.js";
import User from "../models/user.model.js";

const addSubject = async (req, res) => {
    if (req.user && req.user.verified && req.user.role == "admin") {
        let mentor = await User.findOne({
            _id: req.body.mentor
        });
        let section = [];
        let data = [];
        if (req.body.section == 'C') {
            section.push("A", "B");
        } else {
            section.push(req.body.section);
        }
        section.forEach(sec => {
            let sub = {
                branch: req.body.branch,
                year: req.body.year,
                sem: req.body.sem,
                section: sec,
                course_id: req.body.course_id,
                name: req.body.name,
                mentor_id: mentor._id,
                mentor: mentor.name
            }
            data.push(sub);
        });
        try {
            await Subject.insertMany(data);
            res.status(200).json({
                message: `New subject ${data[0].name} has added successfully!`,
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

const getSubject = async (req, res) => {
    if (req.user && req.user.verified && req.user.role == "admin") {
        let users = await User.find({role: {$in: ['admin', 'mentor']}});
        try {
            let data = {
                branch: req.params.branch,
                year: req.params.year,
                sem: req.params.sem
            }
            let subjects = await Subject.find(data);
            res.render("subjects", {user: req.user, subjects: subjects, users: users});
        } catch (error) {
            return res.status(400).json({
                message: errorHandler.getErrorMessage(error),
                status: "error"
            });
        }
    }
}

const deleteSubject = async (req, res) => {
    if (req.user && req.user.verified && req.user.role == "admin") {
        let id = req.params.id;
        try {
            await Subject.deleteOne({
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
    addSubject,
    getSubject,
    deleteSubject
};