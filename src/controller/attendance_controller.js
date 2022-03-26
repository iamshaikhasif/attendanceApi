const ObjectId = require('mongoose').Types.ObjectId;
const Attendance = require("../models/attendance_model");
const { response } = require("../helper/utils");
const { get } = require('express/lib/response');

const attendanceReqToModel = (req) => {
    return {
        cheack_in: req.cheackIn,
        cheack_out: req.cheackOut,
        date: req.date,
        year: req.year,
        month: req.month,
    }
};

const getAttendanceReqToModel = (req) => {
    return {
        month: req.month,
    }
};

const attendanceMarked = async (req, res) => {
    const userRequest = attendanceReqToModel(req.body);

    try {
        getAttendanceData = await Attendance.findOne({ userId: ObjectId(req.user.id), date: userRequest.date });
        console.log(`value `);
        console.log(`value: ${getAttendanceData}`);
        if (getAttendanceData) {
            UpdateAttendanceData = await Attendance.findOneAndUpdate({ userId: ObjectId(req.user.id), date: userRequest.date }, { $set: { cheack_out: userRequest.cheack_out } }, { new: true });
            return response(res, 200, 1, "Attendance already marked.", { UpdateAttendanceData });
        }

        attendanceData = await new Attendance({ ...userRequest, userId: ObjectId(req.user.id) }).save();
        return response(res, 200, 1, "Attendance marked.", { attendanceData });
    } catch (e) {
        return response(res, 500, 0, "Attendance not marked.", userRequest);
    }

}

const getAttendanceMarked = async (req, res) => {
    const userRequest = getAttendanceReqToModel(req.body);

    try {
        getAttendanceData = await Attendance.find({ userId: ObjectId(req.user.id), month: userRequest.month });
        return response(res, 200, 1, "Attendance", { getAttendanceData });
    } catch (e) {
        return response(res, 500, 0, "Attendance Not Found.", userRequest);
    }

}



module.exports = {
    attendanceMarked,
    getAttendanceMarked
};
