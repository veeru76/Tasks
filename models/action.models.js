const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const validator = require('validator');


const actionSchema = new mongoose.Schema({
    name: {
        type : String,
        trim : true
    },
    description : {
        type : String,
        trim : true
    },
    Sid : {
        type : String,
        trim : true
    },
    action : {
        type : String,
    },
    Aid: {
       type: String
    },
    completed : {
        type : Boolean,
        default : false,
    },
    endDate : {
      type : Date,
     
    },
    Priority : {
        type : String,
       
      },
    completionOfTask : {
        type : Number,
        trim : true
      } 
})

const action = mongoose.model('actionSchema', actionSchema);

module.exports = action;