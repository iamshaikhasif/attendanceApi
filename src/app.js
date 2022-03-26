const express = require('express')
require("./db/db_connection.js");
const app = express();
const hostname = "localhost";
const port = process.env.PORT || 8000;


const UserRoutes = require('./routes/user_route');
const AttendanceRoutes = require('./routes/attendance_route');
app.use(express.json());



app.get('/', (req, res) => {
    res.send('Hi Buddy!!!')
});


app.use('/user', UserRoutes);

app.use('/attendance', AttendanceRoutes);

app.listen(port, () => {
    console.log(`Listening on port ${hostname}:${port}!`)
});