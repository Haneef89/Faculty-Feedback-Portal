import Feedback from "../models/feedback.model.js";
import User from "../models/user.model.js";
import Subject from "../models/subject.model.js";
import errorHandler from "../helpers/dbErrorHandler.js";
import moment from 'moment';

const getdates = async(req, res) => {
    if (req.user && req.user.verified && req.user.role == "admin") {
        try {
            let data = {
                branch: req.params.branch,
                year: req.params.year,
                sem: req.params.sem,
                section: req.params.section
            }
            let dates = await Feedback.find(data).distinct("date");
            res.send({dates: dates, message: "No dates found", status: "error"});
        } catch(err) {
            console.log(err);
        }
    }
}

const reports = async (req, res) => {
    if (req.user && req.user.verified && req.user.role != "student") {
        if (req.user.role == "mentor") {
            let data = {
                pending: 0,
                completed: 0
            }
            let users = await User.find({
                branch: req.user.branch,
                year: req.user.year,
                sem: req.user.sem,
                section: req.user.section,
                role: "student"
            });
            users.forEach(user => {
                if (user.feedback) {
                    data.completed++;
                } else {
                    data.pending++;
                }
            })
            res.render("mentor-report", {
                user: req.user,
                users: users,
                data: data
            });
        } else if (req.user.role == "admin") {
            res.render("admin-report", {
                user: req.user,
                users: [],
                subjects: [],
                report: [],
                error: ''
            });
        }
    } else {
        res.redirect("/");
    }
}

function sum(result, prop) {
    var sum = 0;
    result.forEach(rs => {
        sum += rs[prop];
    });
    return sum;
}

const generateConsolidatoryReport = async (req, res) => {
    if (req.user && req.user.verified && req.user.role == "admin") {
    // if (!req.user) {
        try {
            let data = {
                branch: req.params.branch,
                year: req.params.year,
                sem: req.params.sem,
                section: req.params.section,
                role:"student",
                feedback: true
            }
            let nfg = await User.count(data);
            let getdata = {
                branch: req.params.branch,
                year: req.params.year,
                sem: req.params.sem,
                section: req.params.section
            };
            getdata["role"] = "student";
            let ts = await User.count(getdata);
            data["date"] = req.params.date;
            let fbd = [];
            let subjects = await Subject.find({
                branch: req.params.branch,
                year: req.params.year,
                sem: req.params.sem,
                section: req.params.section
            });
            if (subjects.length == 0) {
                res.status(200).render("admin-report", {
                    user: req.user,
                    users: [],
                    subjects: [],
                    report: [],
                    error: 'No Subject Data Found, Please add Subjects'
                })
            } else {
                let feedbacks = await Feedback.find(data);
                if (feedbacks.length == 0) {
                    res.render("admin-report", {
                        user: req.user,
                        users: [],
                        subjects: [],
                        report: [],
                        error: 'No Feedback Data Found'
                    });
                } else {
                    for (var i = 0; i < subjects.length; i++) {
                        let sub = subjects[i];
                        let tc = {"1": 0,"2": 0,"3": 0,"4": 0,"5": 0};
                        let exd = {"1": 0,"2": 0,"3": 0,"4": 0,"5": 0};
                        let sk = {"1": 0,"2": 0,"3": 0,"4": 0,"5": 0};
                        let otsc = {"1": 0,"2": 0,"3": 0,"4": 0,"5": 0};
                        let punc = {"1": 0,"2": 0,"3": 0,"4": 0,"5": 0};
                        let amim = {"1": 0,"2": 0,"3": 0,"4": 0,"5": 0};
                        let ab = {"1": 0,"2": 0,"3": 0,"4": 0,"5": 0};
                        let feedback = feedbacks.filter((f) => {
                            return f.course_id.trim() == sub.course_id.trim();
                        });
                        feedback.forEach(sub => {
                            tc[sub.tc]++;
                            exd[sub.exd]++;
                            sk[sub.sk]++;
                            otsc[sub.otsc]++;
                            punc[sub.punc]++;
                            amim[sub.amim]++;
                            ab[sub.ab]++;
                        })
                        let res = {"tc": tc,"exd": exd,"sk": sk,"otsc": otsc,"punc": punc,"amim": amim,"ab": ab};
                        let ttc = sum(feedback, "tc") / feedback.length;
                        let texd = sum(feedback, "exd") / feedback.length;
                        let tsk = sum(feedback, "sk") / feedback.length;
                        let totsc = sum(feedback, "otsc") / feedback.length;
                        let tpunc = sum(feedback, "punc") / feedback.length;
                        let tamim = sum(feedback, "amim") / feedback.length;
                        let tab = sum(feedback, "ab") / feedback.length;
                        let tavg = (ttc + texd + tsk + totsc + tpunc + tamim + tab) / 7;
                        let avg = {
                            "tc": ttc.toFixed(2),
                            "exd": texd.toFixed(2),
                            "sk": tsk.toFixed(2),
                            "otsc": totsc.toFixed(2),
                            "punc": tpunc.toFixed(2),
                            "amim": tamim.toFixed(2),
                            "ab": tab.toFixed(2),
                            "avg": tavg.toFixed(2)
                        };
                        let s = {
                            branch: sub.branch,
                            year: sub.year,
                            sem: sub.sem,
                            section: sub.section,
                            course_id: sub.course_id,
                            mentor: sub.mentor,
                            name: sub.name,
                            date: moment(feedbacks[0].date).format('DD-MM-YYYY'),
                            avg: avg
                        };
                        fbd.push(s);
                    }
                }
                res.render("admin-report", {
                    user: req.user,
                    users: [],
                    subjects: subjects,
                    report: fbd,
                    ts: ts,
                    nfg: nfg,
                    error: '',
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                message: errorHandler.getErrorMessage(error),
                status: "error"
            });
        }
    } else {
        res.redirect("/");
    }
}

const getSubjectReport = async (req, res) => {
    if (req.user && req.user.verified && req.user.role == "admin") {
        let id = req.params.id;
        let subject = await Subject.findOne({_id: id});
        let users = await User.find({branch: subject.branch, year: subject.year, sem: subject.sem, section: subject.section, role: "student"});
        let feedback = await Feedback.find({branch: subject.branch, year: subject.year, sem: subject.sem, section: subject.section, course_id: subject.course_id});
        let tc = {"1": 0,"2": 0,"3": 0,"4": 0,"5": 0};
        let exd = {"1": 0,"2": 0,"3": 0,"4": 0,"5": 0};
        let sk = {"1": 0,"2": 0,"3": 0,"4": 0,"5": 0};
        let otsc = {"1": 0,"2": 0,"3": 0,"4": 0,"5": 0};
        let punc = {"1": 0,"2": 0,"3": 0,"4": 0,"5": 0};
        let amim = {"1": 0,"2": 0,"3": 0,"4": 0,"5": 0};
        let ab = {"1": 0,"2": 0,"3": 0,"4": 0,"5": 0};
        feedback.forEach(sub => {
            tc[sub.tc]++;
            exd[sub.exd]++;
            sk[sub.sk]++;
            otsc[sub.otsc]++;
            punc[sub.punc]++;
            amim[sub.amim]++;
            ab[sub.ab]++;
        })
        let data = {"tc": tc,"exd": exd,"sk": sk,"otsc": otsc,"punc": punc,"amim": amim,"ab": ab};
        let ttc = sum(feedback, "tc") / feedback.length;
        let texd = sum(feedback, "exd") / feedback.length;
        let tsk = sum(feedback, "sk") / feedback.length;
        let totsc = sum(feedback, "otsc") / feedback.length;
        let tpunc = sum(feedback, "punc") / feedback.length;
        let tamim = sum(feedback, "amim") / feedback.length;
        let tab = sum(feedback, "ab") / feedback.length;
        let tavg = (ttc + texd + tsk + totsc + tpunc + tamim + tab) / 7;
        let avg = {
            "tc": ttc.toFixed(2),
            "exd": texd.toFixed(2),
            "sk": tsk.toFixed(2),
            "otsc": totsc.toFixed(2),
            "punc": tpunc.toFixed(2),
            "amim": tamim.toFixed(2),
            "ab": tab.toFixed(2),
            "avg": tavg.toFixed(2)
        };
        return res.status(200).json({
            subReport: {data: data, avg: avg, feedback: feedback, subject: subject, users: users}
        });
    } else {
        res.redirect("/");
    }
}

export default {
    reports,
    generateConsolidatoryReport,
    getSubjectReport,
    getdates
};