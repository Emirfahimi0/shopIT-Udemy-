const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/user");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require('cloudinary');

// Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const result = await cloudinary.v2.uploader.upload(req.body.avatar, {

    folder: 'avatars',
    width: '150',
    crop: 'scale',
  })

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });

  sendToken(user, 200, res);
});

// Login a user => /api/v1/login

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Check validation of input by user

  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  // Find user in MongoDB
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid credentials - user not found", 401));
  }

  // check if password correct or not

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("error password does not match", 401));
  }

  sendToken(user, 200, res);
});

// Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("no user with this email", 401));
  }

  // Get reset Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `\tYou are receiving this email because you (or someone else) have requested the reset of 
        the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`;

  try {
    await sendEmail({
      email: user.email,
      subject: "ShopIt Password Reset Request",
      message,
    });

    res.status(200).json({
      status: true,
      message: `An email has been sent to you ${user.email} with further instructions.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password => /api/v1/password/reset/:token

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Invalid token for resetting password or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  // Update or set up the new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user,200,res);

});

// Get currently logged in user details => api/v1/me

exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {

  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user: user,
  });

})

// Update or change password => api/v1/password/update

exports.updatePassword = catchAsyncErrors(async (req, res, next) =>{

  const user = await User.findById(req.user.id).select('+password')

  // Check previous user's password

  const isPasswordMatched = await user.comparePassword(req.body.currentPassword);
    
  if(!isPasswordMatched){
    return next(new ErrorHandler("Current password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user,200,res)

})

// Update user profile   =>   /api/v1/me/update
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  
  
  const newUserData = {
      name: req.body.name,
      email: req.body.email
  }

  // Update avatar
  if (req.body.avatar !== '') {
      const user = await User.findById(req.user.id)

      const image_id = user.avatar.public_id;
      const res = await cloudinary.v2.uploader.destroy(image_id);

      const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: 'avatars',
          width: 150,
          crop: "scale"
      })

      newUserData.avatar = {
          public_id: result.public_id,
          url: result.secure_url
      }
  }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      userFindAndModify: true
    });

    res.status(200).json({
      success: true,
      user: user,
    })
})


// Logout a user => /api/v1/logout
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  //reset cookies
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logout",
  });
});


//Admin routes

// get all users => /api/v1/admin/users

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {

  const users = await User.find();

  res.status(200).json({
    success: true,
    users: users,
  }); 

});

// get user details => /api/v1/admin/user:id


exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {

  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User not found with id: ${req.params.id} `, 404));
  }

  res.status(200).json({
    status: "success",
    user: user,
  });

});

// Update user profile => api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role:req.body.role
  } 

  // TODO: update avatar 


  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    userFindAndModify: true
  });

  res.status(200).json({
    success: true,
    user: user,
  })
})

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User not found with id: ${req.params.id} `, 404));
  }

  // Remove avatar from cloudinary : TODO
  await user.remove();

  res.status(200).json({
    success: true,
  });

});