import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
    rollno: String,
    branch: String,
    year: Number,
    sem: Number,
    section: String,
    date: String,
    course_id: String,
    name: String,
    tc: Number,
    exd: Number,
    sk: Number,
    otsc: Number,
    punc: Number,
    amim: Number,
    ab: Number
}, {
    collection: "feedback"
});

export default mongoose.model('Feedback', FeedbackSchema);