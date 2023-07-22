const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true,'Please enter a name'],
        maxLength: [30,'Your name must be at least 30 characters']

    },
    email:{
        type: String,
        required: [true,'Please enter an email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true,'Please enter a password'],
        minlength: [6,'Your password must be at least 6 characters'],
        select: false
    },
    avatar: {
        public_id:{
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});


// Encrypt the password before saving user
userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password,10)

})


//Compare user password 
userSchema.methods.comparePassword = async function (enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password)
}

// Return jwt Token
userSchema.methods.getJwtToken = function(){

    return jwt.sign({id:this.id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_TIME

    })
}

// Generates paswords reset token

userSchema.methods.getResetPasswordToken = function(){
    // Generates token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash and set to resetPasswordToken (encrypted) 
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // set Token expired time
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000

    return resetToken;

}

module.exports = mongoose.model('User', userSchema);