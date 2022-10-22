import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
    branch: String,
    year: Number,
    sem: Number,
    section: String,
    course_id: String,
    name: String,
    mentor_id: String,
    mentor: String
}, {collection: "subjects"});

export default mongoose.model('Subject', SubjectSchema);