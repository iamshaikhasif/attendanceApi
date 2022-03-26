const jwt = require("jsonwebtoken");
const User = require("../models/user_model");
const Token = require("../models/token_model");
const OTPModel = require("../models/otp_model");
const { response } = require("../helper/utils");
const { sendMail } = require("../helper/send_mail");
const bcrypt = require("bcryptjs");


const mapReqToModel = (req) => {
  return {
    firstName: req.firstName,
    lastName: req.lastName,
    gender: req.gender,
    dob: req.dob,
    mobile: req.mobile,
    email: req.email,
    pin: req.pin
  }
};

const loginReqToModel = (req) => {
  return {
    email: req.email,
    pin: req.pin
  }
};

const forgetPassReqToModel = (req) => {
  return {
    email: req.email
  }
};



const signUp = async (req, res) => {
  const userRequest = mapReqToModel(req.body); //return request
  try {
    //find user already exist or not
    let user = await User.findOne({
      email: userRequest.email,
    });
    if (user) {
      return response(res, 400, 0, "User Already Exists", {});
    }

    //encrypt the pin number
    const salt = await bcrypt.genSalt(10);
    userRequest.pin = await bcrypt.hash(userRequest.pin, salt);

    //save the user to database
    user = new User({ ...userRequest });
    await user.save();

    //genrate token 
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      "randomString",
      {
        expiresIn: '365d',
      },
      async (err, encodedToken) => {
        if (err) throw err;

        token = new Token({
          user_id: user.id,
          token: encodedToken,
        });
        await token.save();
        return response(res, 200, 1, "User Successfully Registered", { token: encodedToken, user });
      }
    );
  } catch (err) {
    return response(res, 500, 0, "Exception", { error: err });
  }
}


const login = async (req, res) => {
  const userRequest = loginReqToModel(req.body);
  let user = await User.findOne({
    email: userRequest.email,
  });
  if (!user) {
    return response(res, 400, 0, "User Not Found", {});
  }

  const isMatch = await bcrypt.compare(userRequest.pin, user.pin);

  if (isMatch) {
    //genrate token 
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      "randomString",
      {
        expiresIn: '365d',
      },
      async (err, encodedToken) => {
        if (err) throw err;
        let token = await Token.findOneAndUpdate({ user_id: user.id }, { $set: { token: encodedToken } }, { new: true });
        if (!token) {
          token = new Token({
            user_id: user.id,
            token: encodedToken,
          });
          await token.save();
        }
        return response(res, 200, 1, "User Successfully Login", { token: encodedToken, user });
      }
    );
  } else {
    return response(res, 400, 0, "Invalid Password", {});
  }



}

const verifyEmail = async (req, res) => {
  const userRequest = forgetPassReqToModel(req.body);
  let user = await User.findOne({
    email: userRequest.email,
  });
  if (!user) {
    return response(res, 200, 0, "User Not found.", {});
  }

  var otp = Math.floor(1000 + Math.random() * 9000);

  let otpSave = await OTPModel.findOne({
    email: userRequest.email,
  });

  if (otpSave) {
    sendMail(userRequest.email, "Test OTP", `your otp is ${otp} don't share your otp`);
    UpdateOtpData = await OTPModel.findOneAndUpdate({ email: userRequest.email }, { $set: { otp } }, { new: true });
    return response(res, 200, 1, "Resend OTP.", {otp, UpdateOtpData});
  }

  sendMail(userRequest.email, "Test OTP", `your otp is ${otp} don't share your otp`);
  otpData = await new OTPModel({otp, ...userRequest }).save();
  

  return response(res, 200, 1, "OTP send.", {otp, otpData});



}


const verifyOtp = async (req, res) => {
  let user = await OTPModel.findOne({
    email: req.body.email,
  });
  if (!user) {
    return response(res, 200, 0, "Email id is incorrect.", {});
  }

  if(req.body.otp != user.otp){
    return response(res, 200, 2, "Incorrect OTP", {otp: req.body.otp, user_otp: user.otp});
  }

  return response(res, 200, 1, "Success", {otp: req.body.otp, user_otp: user.otp});
}





module.exports = {
  signUp,
  login,
  verifyEmail,
  verifyOtp
};