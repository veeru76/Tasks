const express = require('express');
const { default: mongoose } = require('mongoose');
const router = new express.Router();
const Task = require('../models/task.models')
const subtasks = require('../models/subtask.models')
const action = require('../models/action.models')
const project = require('../models/project.model')
 
// Get all Tasks
router.get('/tasks', async (req, res) => {
    try {
        const task = await Task.find({});
        res.status(200).send(task)
    }
    catch (e) {
        res.status(500).send(err);
    }
})

// action history

router.get('/actionhistory/:id', async(req, res) => {
    const id = req.params.id
    try {
        const task = await action.find({Aid :id })
        res.status(200).send(task)
    }
    catch (e) {
        res.status(404).send(err);
    }
})

// tags to task
router.post('/tags', async(req, res) => {
    try {
        const task = await Task.find(req.body)
        res.status(200).send(task)
    }
    catch (e) {
        res.status(404).send(err);
    }
})

// Get Tasks By percent of Completion
// router.post('/tasks', async (req, res) => {
//     try {
//         const task = await Task.find(req.body.completionOfTask);
//         const gt = task.map(ele => ele.completionOfTask > 30)
//         res.status(200).send(gt);
//     }
//     catch (err) {
//         res.status(400).send(err);
//     }
// })

// Get task by Id
router.get('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await Task.findById(id)
        if (!result) return res.status(500).send()
        const Sid = result.Sid;
        const stask = await subtasks.find({Sid : Sid})
        res.status(200).json({
         task : result,
         stasks : stask
        })
    }
    catch (err) {
        res.status(500).send(err)
    }
})


// creating projects

router.post('/Projects', async(req, res) => {
    const Project = new project(req.body);
    try {
        await Project.save()
        res.status(201).send(Project)
    }
    catch (err) {
        res.status(400).send(err)
    }
})
 
// Get Projects with Tasks in it
router.get('/Projects/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await project.find({projectId : id})
        if (!result) return res.status(500).send()
        const task = await Task.find({projectId : id})
        res.status(200).json({
         Project : result,
         tasks : task
        })
    }
    catch (err) {
        res.status(400).send(err)
    }
})
// creating tasks

router.post('/tasks', async (req, res) => {
    var id = new mongoose.Types.ObjectId();
    req.body["Sid"] = id._id 
    const task = new Task(req.body);
    try {
        await task.save()
        res.status(201).send(task)
    }
    catch (err) {
        res.status(400).send(err)
    }
})
// creating subtasks

router.post('/subtasks/:id', async (req, res) => {
    const id = req.params.id
    const result = await Task.findById(id);
    if(result) {
    req.body["Sid"] = result.Sid    
    const task = new subtasks(req.body);
    try {
        await task.save()
        res.status(201).send(task)
    }
    catch (err) {
        res.status(400).send(err)
    }
  }
})

// get subtasks
router.get('/subtasks/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await subtasks.find({Sid : id})
        if (!result) return res.status(500).send()
        res.status(200).send(result)
    }
    catch (err) {
        res.status(500).send(err)
    }
})

//update subtasks
router.patch('/subtasks/:id', async(req, res) => {
    
    try{
        const task = await subtasks.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators : true
        });
       
        res.status(201).json({
            status : 'success',
            task : task
        })
    } catch (err) {
        res.status(404).json({
            status : 'fail',
            message : err
        })
    }
})

// delete subtasks

router.delete('/subtasks/:id', async(req, res) => {
    const id = req.params.id;
    try {
        await subtasks.findOneAndDelete(id);
        res.status(204).json({
            status : 'success',
            message : null
        })
    }
    catch (err) {
        res.status(404).json({
            status : 'fail',
            message : err
        })
    }
})
//update tasks

router.patch('/tasks/:id', async(req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ['name','description', 'completed', "endDate", "Priority","completionOfTask"];
    const isValidateOperation = updates.every((update) => allowUpdates.includes(update));
    if (!isValidateOperation) {
        return res.status(400).send({ error: 'invalid updates' })
    }
    try{
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators : true
        })
        if(task) {
            req.body["action"] = 'update';
            req.body["Aid"] = req.params.id;
            const Htask = new action(req.body);
            console.log(Htask)
            await Htask.save()
        }
        
        res.status(200).json({
            status : 'success',
            task : task
        })
    } catch (err) {
        res.status(404).json({
            status : 'fail',
            message : err
        })
    }
})


// Deleting Tasks

router.delete('/tasks/:id', async(req, res) => {
    try {
  const task = await Task.findByIdAndDelete(req.params.id);
        if(task) {
            req.body["action"] = 'delete';
            req.body["name"] = task.name;
            req.body["Aid"] = req.params.id;
            const Htask = new action(req.body);
            console.log(Htask)
            await Htask.save()
        }
        res.status(204).json({
            status : "success",
            data : "null"
        })    }
    catch(e) {
        res.status(400).send()
    }
})


module.exports = router;