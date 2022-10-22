import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
    branch: String,
    year: Number,
    sem: Number,
    section: String,
    date: String
}, {collection: "schedule"});

export default mongoose.model('Schedule', ScheduleSchema);