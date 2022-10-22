import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new mongoose.Schema({
    rollno: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    password: {
        type: String,
        required: 'Password is required'
    },
    branch: String,
    year: Number,
    sem: Number,
    role: String,
    section: String,
    verified: Boolean,
    ftl: Boolean,
    feedback: Boolean
}, {collection: "users"});

UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

export default mongoose.model('User', UserSchema);