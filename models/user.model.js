const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const md5 =require('md5');
const Task = require('./task.models');
const userSchema = new mongoose.Schema({

    name : {
        type : String,
       required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        validate : [validator.isEmail, "please provide valid email "]   
    },
    photo : {
        type : String
    },
    password : {
        type : String,
        required : [true, 'please provide a valid password']
    },
    confirmPassword : {
        type : String,
        required : [true, 'please provide confirm password'],
        validate : {
       validator: function(el) {
           return el === this.password
       },
       message : "passwords are not same"
     }
    },
    passwordResetToken : String,
    passwordResetExpires : Date
})

userSchema.pre('save',  async function(next) {
    const user = this;
    if(user.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    // Delete passwordConfirm field
  this.confirmPassword = undefined;
  next();
    })

userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

userSchema.methods.createPasswordResetToken = async function() {
const resetToken = crypto.randomBytes(32).toString('hex');
console.log(resetToken)
 this.passwordResetToken = crypto
.createHash('sha256')
.update(resetToken)
.digest('hex');
console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
}
const User = mongoose.model('User', userSchema)

module.exports = User;