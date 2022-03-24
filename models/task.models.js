const mongoose = require('mongoose');
const slugify = require('slugify')
const { stringify } = require('nodemon/lib/utils');
const validator = require('validator');
const User = require('./user.model');

const taskSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        trim : true,
        unique : true,
        maxlength : ['10', '10 is the maxlength for name'],
        minlength : ['5', '5 is the minlength for name']
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
    startDate : {
        type : Date,
        required : true,
        default: Date.now()
      },
    slug : String,
    endDate : {
      type : Date,
      required : true,
      trim : true
    },
    Priority : {
        type : String,
        required : true,
        trim : true,
        enum : {
          values : ['low', 'medium', 'high','emergency'],
          message : "only those words "
        }
      },
    completionOfTask : {
        validate : {
            validator : 
            function(val) {
                return val < 100
            },
            message : "completion of task is 100% only",
        },
        
        type : Number,
        required : true,
        trim : true
      }
})

taskSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower : true })
    next()
})

// taskSchema.post('save', function(doc, next) {
//     console.log(doc)
//     next()
// })
const Task = mongoose.model('Task', taskSchema);


module.exports = Task;