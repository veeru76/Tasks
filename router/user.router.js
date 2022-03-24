const express = require('express');
const multer  = require('multer')
const { default: mongoose } = require('mongoose');
const userRouter = new express.Router();
const User = require('../models/user.model');
const authController = require('../controllers/authControllers')
const jwt = require('jsonwebtoken');
const config = require('../config');
const jwtObj = require('../jwt')
const sendEmail = require('../mailObj')
const crypto = require('crypto');
const forgotPassword = require('../models/forgot.models');
const { pass } = require('../config');


userRouter.post('/signup', async(req, res, next) =>{
    try {
    const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  })
  // create access token
   const id = newUser.id;

//   // output
//   const output = {};

//   output.access_token = jwtObj.sign({}, jwtid, 'ACCESS_TOKEN');
//   output.expires_in = config.expiresIn['ACCESS_TOKEN'];

//   // create refresh_token
//   output.refresh_token = jwtObj.sign({}, jwtid, 'REFRESH_TOKEN');
sendEmail({
    to: req.body.email,
    subject: `veeru's task - Register successfully`,
    text : `receive mail`
  });

  
  res.status(201).json({
      user : newUser
      })
  }
catch(err) {
    res.status(400).send(err)
}
})

userRouter.post('/login', async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).send("check the credentials again")
    }

    const user = await User.findOne({email}).select('+password')
    if(!user || !(user.correctPassword(user.password, password))) {
        return res.status(400).send("login failed")
    }
    //create access token
   const jwtid = user.id;

     // output
     const output = {};
   
     output.access_token = jwtObj.sign({}, jwtid, 'ACCESS_TOKEN');
     output.expires_in = config.expiresIn['ACCESS_TOKEN'];
   
     // create refresh_token
     output.refresh_token = jwtObj.sign({}, jwtid, 'REFRESH_TOKEN');
     res.status(200).json({
         user : user,
        token : output})
})

// forgot password
userRouter.post('/forgot', async(req, res, next) => {
    const {email} = req.body;
    const mail = await User.findOne({email : email});
    console.log(mail)
    if (!mail) {
        res.status(410).json({
          error: {
            type: 'GONE',
            message: [{
              property: 'email_id',
              value: req.body.email,
              message: 'The target resource is no longer available at the origin server'
            }]
          }
        });
        return;
      }
      const resetToken = await mail.createPasswordResetToken();
      console.log("resetToken",resetToken)
      await mail.save({ validateBeforeSave: false });
      
    
// send mail
const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: mail.email,
      subject: 'Your password reset token (valid for 10 min)',
      text : message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    mail.passwordResetToken = undefined;
    mail.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return ''
};
})
// reset password
  userRouter.patch('/resetPassword/:id', async(req, res) => {
      // 1.hash the token
      try {
          const htoken = req.params.id

          const user = await User.findOne({ passwordResetToken : htoken, 
            passwordResetExpires : {$gt : Date.now() } })
          if(!user) {
             res.status(404).send("link token expiresd")
          }
          user.password = req.body.password;
          user.confirmPassword = req.body.confirmPassword;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          await user.save();
          const jwtid = user.id;

          // output
          const output = {};
        
          output.access_token = jwtObj.sign({}, jwtid, 'ACCESS_TOKEN');
          output.expires_in = config.expiresIn['ACCESS_TOKEN'];
        
          // create refresh_token
          output.refresh_token = jwtObj.sign({}, jwtid, 'REFRESH_TOKEN');
          res.status(200).json({
              user : user,
             token : output})
      }catch(err) {
          res.send(err)
      }
  })


//
userRouter.get('/forgot/:user_id?verify_id', async(req, res, next) => {
try {
const {verify_id} = req.params.verify_id
const user_id = req.query.user_id
const isVerify = await forgotPassword.findOne({user_id : user_id});
if(!isVerify.length) {
    return 
}
else if(isVerify){
    let expiry = new Date().setMinutes(5);
    const vDate = isVerify[0].createdAt;
    let toTimestamp = vDate => Date.parse(vDate);
    const time =  (expiry > toTimestamp) ? true : false;
    if(!time) res.status(500).json({message : "link expired "})
}
else {
res.status(200).json({
 verify_id : verify_id,
 user_id : user_id
})
} 
}
catch(err) {
    res.send(err)
}   
})

userRouter.put('/forgot/:verify_id?user_id', async(req, res, next) => {
try {
const {password} = req.body;
const verify_id = req.params
const user_id = req.query;
const isVerify = await forgotPassword.findOne({user_id : user_id});
if(!isVerify.length) {
    return 
}
else if(isVerify){
    let expiry = new Date().setMinutes(5);
    const vDate = isVerify[0].createdAt;
    let toTimestamp = vDate => Date.parse(vDate);
    const time =  (expiry > toTimestamp) ? true : false;
    if(!time) res.status(500).json({message : "link expired "})
}
const newUser = await User.password.findByIdAndUpdate({
    uid : user_id,
    password: password
  })
  res.status(204).send(newUser)
}catch(err) {
  res.send(Error)
}
})

// file upload
const upload = multer({
    dest : 'avatar',
    limits : {
        fileSize : 1024000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return new Error(cb ('only images are allowed'))
        }
        cb(undefined, true)
    }
})

// userRouter.post('/user/avatar', authController, upload.single('avatar'), (req, res) => {
//     req.user.avatar = req.file.buffer;
//     res.send()},(error, req, res, next) => {
//     res.status(400).send({error : error.message })
//     }
// )
module.exports = userRouter;