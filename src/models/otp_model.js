const mongoose = require('mongoose');

var OTPSchema = mongoose.Schema({
    otp: { type: String, required: true },
    email: { type: String, required: true },
    is_deleted: { type: Boolean, default: false },
}, { timestamps: true });


module.exports = mongoose.model('otp', OTPSchema, 'otps');