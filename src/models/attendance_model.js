const mongoose = require('mongoose');


const AttendanceSchema = mongoose.Schema({
    cheack_in: {
        type: String
    },
    cheack_out: {
        type: String
    },
    date: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
});


module.exports = mongoose.model('attendance', AttendanceSchema);