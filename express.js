import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import ejs from 'ejs';
import path from 'path';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import session from 'express-session';
// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const ejs = require("ejs");
// const path = require("path");
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
// const session = require("express-session");
import authRoutes from './routes/auth.routes.js';
import appRoutes from "./routes/app.routes.js";
import userRoutes from './routes/user.routes.js';
import scheduleRoutes from "./routes/schedule.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import reportRoutes from './routes/report.routes.js';

const app = express();
var __dirname = path.resolve();

global.init = false;

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(express.static(__dirname+"/public"));

app.use(session({
    secret: "svckkadapa",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRoutes);
app.use("/", appRoutes);
app.use("/", userRoutes);
app.use("/", scheduleRoutes);
app.use("/", subjectRoutes);
app.use("/", feedbackRoutes);
app.use("/", reportRoutes);


app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({"error" : err.name + ": " + err.message})
    }else if (err) {
        res.status(400).json({"error" : err.name + ": " + err.message})
        console.log(err)
    }
});

export default app;