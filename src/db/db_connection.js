const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/attendenceAPI", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database.")
}).catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
})