const mongoose = require('mongoose');
const validator = require('validator');


const subtaskSchema = new mongoose.Schema({
    Sdesc : {
        type : String,
        required : true,
        trim : true
    },
    Sname : {
        type : String,
        required : true,
        trim : true
    },
    Sid: {
        type: String,
     }
})

const SubTasks = mongoose.model('SubTasks', subtaskSchema);

module.exports = SubTasks;