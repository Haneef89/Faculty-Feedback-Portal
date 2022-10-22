import bcrypt from "bcrypt";
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import User from '../models/user.model.js';
import errorHandler from '../helpers/dbErrorHandler.js';

const saltRounds = "";

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const registerStudent = async (req, res) => {
    let data = req.body;

    if (data.password == data.confirmPassword) {
        const hash = await bcrypt.hash(data.password, saltRounds);
        data.password = hash;
        data.role = 'student';
        let user = new User(data);
        try {
            await user.save();
            res.status(200).json({
                message: "Successfully signed up!",
                status: "success"
            });
        } catch (error) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(error)
            });
        }
    }
}

const registerAdmin = async (req, res) => {
    let data = req.body;

    if (data.password == data.confirmPassword) {
        const hash = await bcrypt.hash(data.password, saltRounds);
        data.password = hash;
        data.role = 'admin';
        data.verified = true;
        data.ftl = true;
        let user = new User(data);
        try {
            await user.save();
            global.init = true;
            return res.status(200).json({
                message: "Successfully signed up!",
                status: "success"
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: errorHandler.getErrorMessage(error)
            });
        }

    }
}

const signin = async (req, res) => {
    let data = req.body;
    try {
        let user = await User.findOne({
            email: data.email
        });
        if (user == null) {
            return res.status(200).json({
                message: "Your Account not found. Please create an account!",
                status: "error",
                action: "Try Again!"
            });
        }
        let checkPassword = await bcrypt.compare(data.password, user.password);
        if (!checkPassword) {
            return res.status(200).json({
                message: "Dear " + user.name + ",\n The Password you have entered is incorrect.",
                status: "error",
                action: "Try Again"
            });
        } else if (user.verified == false) {
            return res.status(200).json({
                message: "Dear " + user.name + ",\n You are not verified! contact your admin.",
                status: "error",
                action: "Try Again"
            });
        } else {
            req.login(user, function (er) {
                if (er) {
                    res.redirect("/");
                }
            });
            return res.status(200).json({
                message: "Dear " + user.name + ", You have logged in successfully!",
                status: "success",
                action: "Go to Home"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: errorHandler.getErrorMessage(error)
        });
    }
}

const logout = async (req, res) => {
    if (req.user) {
        let name = req.user.name;
        req.logout();
        return res.status(200).json({
            message: "Successfully logged out",
            name: name,
            status: "success"
        });
    }
}

export default {
    registerStudent,
    registerAdmin,
    signin,
    logout
};