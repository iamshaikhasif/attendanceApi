var express = require('express')
var router = express.Router();
const Authorize = require("../midleware/verify_token");
const Attendance = require("../controller/attendance_controller");

router.post("/marked", Authorize, Attendance.attendanceMarked);

router.post("/getList", Authorize, Attendance.getAttendanceMarked);


module.exports = router;