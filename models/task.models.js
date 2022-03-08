const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const validator = require('validator');

const taskSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        required : true,
        trim : true
    },
    projectId : {
        type : String,
        required : true,
    },
    Sid: {
       type: String
    },
    completed : {
        type : Boolean,
        default : false,
    },
    endDate : {
      type : Date,
      required : true,
      trim : true
    },
    Priority : {
        type : String,
        required : true,
        trim : true
      },
    completionOfTask : {
        type : Number,
        required : true,
        trim : true
      } 
})


const Task = mongoose.model('Task', taskSchema);


module.exports = Task;