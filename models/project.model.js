const mongoose = require('mongoose');
const validator = require('validator');


const projectSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    projectId : {
        type : String,
        default : mongoose.Types.ObjectId(),
        trim : true
    },
})

const projects = mongoose.model('projects', projectSchema);

module.exports = projects;