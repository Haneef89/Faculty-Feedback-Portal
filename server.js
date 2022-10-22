import app from "./express.js";
import mongoose from "mongoose";

mongoose.Promise = global.Promise;
const PORT = process.env.PORT || 80;
const MONGOURL = "";

mongoose.connect(MONGOURL, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) {
        console.log(err);
    }
    console.info("Connected to database at %s.", MONGOURL);
});

mongoose.connection.on('error', () => {
    console.log(`unable to connect to database ${MONGOURL}.`);
});

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.info("Server started at port %s. go to http://localhost:3000/", PORT);
});