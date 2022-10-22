import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import extend from 'lodash/extend.js'
import errorHandler from '../helpers/dbErrorHandler.js';

const saltRounds = "";

const updateSelf = async (req, res) => {
    if (req.user && req.user.verified) {
        if (req.body.oldPassword && req.body.newPassword == req.body.oldPassword) {
            return res.status(200).json({
                message: "The new Password cannot be the same as the old password.",
                status: "error",
                name: req.user.name
            });
        } else if (req.body.oldPassword && req.body.newPassword == req.body.confirmPassword) {
            try {
                let user = req.user;
                let checkPassword = await bcrypt.compare(req.body.oldPassword, user.password);
                if (!checkPassword) {
                    return res.status(200).json({
                        message: "The Password you have entered is incorrect.",
                        status: "error",
                        name: user.name
                    });
                } else {
                    let password = await bcrypt.hash(req.body.newPassword, saltRounds);
                    user = extend(user, {
                        name: req.body.name,
                        password: password
                    });
                    await user.save();
                    return res.status(200).json({
                        message: "Successfully Updated!",
                        status: "success",
                        name: user.name
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }
        } else {
            try {
                let user = req.user;
                user = extend(user, req.body);
                await user.save();
                return res.status(200).json({
                    message: "Sucessfully Updated!",
                    status: "success",
                    name: user.name
                });
            } catch (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }
        }
    } else {
        res.redirect("/");
    }
}

const signup = async (req, res) => {
    try {
        let user = User.findOne({
            email: req.body.email
        });
        if (user) {
            return res.status(400).json({
                message: "User Already Exists!",
                status: "error"
            });
        } else {
            let user = new User(req.body);
            await user.save();
            return res.status(400).json({
                message: "Successfully Registered!",
                status: "success"
            });
        }

    } catch (err) {
        return res.status(400).json({
            message: errorHandler.getErrorMessage(err),
            status: "error"
        });
    }
}

const addUsers = async (req, res) => {
    if (req.user && req.user.role != "student" && req.user.verified) {
        let data = req.body.jsonData;
        if (data.length == 0) {
            return res.status(200).json({
                message: "No Users to add! Please select an xlsx file",
                status: "error"
            });
        }
        for (let i = 0; i < data.length; i++) {
            let u = data[i];
            if (u.rollno) {
                u.rollno = u.rollno.toUpperCase();
            }
            u.section = u.section.toUpperCase();
            u.role = u.role.toLowerCase();
            u.branch = u.branch.toLowerCase();
            u.feedback = false;
            u.verified = false;
            u.ftl = true;
            let hash = await bcrypt.hash(u.password.toString(), saltRounds);
            u.password = hash;
        }
        try {
            await User.insertMany(data);
            return res.status(200).json({
                message: "Successfully Inserted Users!",
                status: "success"
            });
        } catch (error) {
            return res.status(200).json({
                message: errorHandler.getErrorMessage(error),
                status: "error"
            });
        }
    } else {
        return res.status(200).json({
            message: "Failed to add users!",
            status: "error"
        });
    }
}

const deleteUser = async (req, res) => {
    if (req.user && req.user.role != "student" && req.user.verified) {
        let id = req.params.id;
        try {
            let deletedUser = await User.deleteOne({
                _id: id
            });
            return res.status(200).json({
                message: `Successfully deleted ${deleteUser.name}`,
                status: "success"
            });
        } catch (err) {
            return res.status(200).json({
                message: "Failed to delete user!",
                status: "error"
            });
        }
    } else {
        res.redirect("/");
    }
}

const verifyUser = async (req, res) => {
    if (req.user && req.user.role != "student" && req.user.verified) {
        let id = req.params.id;
        try {
            await User.updateOne({
                _id: id
            }, {
                verified: true
            });
            return res.status(200).json({
                message: `Successfully verified user`,
                status: "success"
            });
        } catch (err) {
            return res.status(200).json({
                message: "Failed to verify user!",
                status: "error"
            });
        }
    } else {
        res.redirect("/");
    }
}

const updateUser = async (req, res) => {
    if (req.user && req.user.verified) {
        if (req.body.newPassword) {
            try {
                let password = await bcrypt.hash(req.body.newPassword, saltRounds);
                await User.updateOne({
                    email: req.body.email
                }, {
                    name: req.body.name,
                    password: password,
                    branch: req.body.branch,
                    year: req.body.year,
                    sem: req.body.sem,
                    section: req.body.section
                });
                return res.status(200).json({
                    message: "Successfully Updated!",
                    status: "success",
                    name: req.user.name
                });
            } catch (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }
        } else {
            try {
                await User.updateOne({
                    email: req.body.email
                }, req.body);
                return res.status(200).json({
                    message: "Sucessfully Updated!",
                    status: "success",
                    name: req.user.name
                });
            } catch (err) {
                console.log(err);
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }
        }
    } else {
        res.redirect("/");
    }
}

const editUser = async (req, res) => {
    if (req.user && req.user.role != "student") {
        let id = req.params.id;
        try {
            let user = await User.findOne({
                _id: id
            });
            return res.status(200).render("edit-user", {
                user: user
            });
        } catch (err) {
            return res.status(200).json({
                message: "Failed to verify user!",
                status: "error"
            });
        }
    } else {
        res.redirect("/");
    }
}

const deleteAll = async (req, res) => {
    if (req.user && req.user.verified && req.user.role == "mentor") {
        try {
            await User.deleteMany({
                branch: req.user.branch,
                year: req.user.year,
                sem: req.user.sem,
                section: req.user.section,
                role: "student"
            });
        } catch (err) {
            return res.status(200).json({
                message: "Failed to verify user!",
                status: "error"
            });
        }
        res.redirect("/");
    } else {
        res.redirect("/");
    }
}

const verifyAll = async (req, res) => {
    if (req.user && req.user.verified && req.user.role == "mentor") {
        try {
            await User.updateMany({
                branch: req.user.branch,
                year: req.user.year,
                sem: req.user.sem,
                section: req.user.section,
                role: "student"
            }, {
                verified: true
            });
        } catch (err) {
            return res.status(200).json({
                message: "Failed to verify user!",
                status: "error"
            });
        }
        res.redirect("/");
    } else {
        res.redirect("/");
    }
}

const clearFeedbackStatus = async (req, res) => {
    if (req.user && req.user.verified && req.user.role != "student") {
        try {
            await User.updateMany({
                branch: req.user.branch,
                year: req.user.year,
                sem: req.user.sem,
                section: req.user.section,
                role: "student"
            }, {
                feedback: false
            });
        } catch (err) {
            return res.status(200).json({
                message: "Failed to verify user!",
                status: "error"
            });
        }
        res.redirect("/");
    } else {
        res.redirect("/");
    }
}

export default {
    updateSelf,
    addUsers,
    deleteUser,
    verifyUser,
    editUser,
    updateUser,
    deleteAll,
    verifyAll,
    clearFeedbackStatus,
    signup
};