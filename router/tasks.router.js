const express = require('express');
const { default: mongoose } = require('mongoose');
const taskRouter = new express.Router();
const Task = require('../models/task.models')
const subtasks = require('../models/subtask.models')
const action = require('../models/action.models')
const project = require('../models/project.model');
const { query } = require('express');
const req = require('express/lib/request');
const moment = require('moment');
const res = require('express/lib/response');
const authController = require('../controllers/authControllers')
// Get all Tasks
taskRouter.get('/tasks', authController.authChecker, async (req, res) => {
    try {
        console.log(req.query)
        let query =  Task.find();

        // Sorting
        if(req.query.sort) {
            query = query.sort(req.query.sort)
        }
        else {
            query = query.sort('-endDate')
        }

        // Limiting
        if(req.query.fields) {
            const fields = req.query.fields.split(',').join('');
            query = query.select(fields)
        }
        else {
            query = query.select('-__v')
        }

        //pagination

      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 100
      const skip = (page - 1)*limit;

      query = query.skip(skip).limit(limit);

      if(req.query.page) {
          const numTours = await Task.countDocuments();
          if(skip > numTours) throw new Error('page does not exist')
      }
        const tours = await query;

        res.status(200).send(tours)
    }
    catch (err) {
        res.status(500).send(err);
    }
})

//getTodayTasks
taskRouter.get('/getTodayTasks', async(req, res) => {
    try {
    const date = moment(new Date()).format('YYYY-MM-DD');
    const task = await Task.find({startDate : date})
    res.status(200).json({
        data : task
    })
}
catch (err) {
    res.status(400).send(err)
} 
})

//getUpComingTasks
taskRouter.get('/getUpComingTasks', async(req, res) => {
    try {
        const date = moment(new Date()).format('YYYY-MM-DD');
        const task = await Task.aggregate([
            {
                $match : {startDate : {$gte :ISODate(date)} }
            }])
            res.status(200).json({
                data : task
            })

    } catch (error) {
        res.status(400).send(error)
    }
})
// taskStats

taskRouter.get('/getTaskstats', async(req, res) => {
    try {
    const task = await Task.aggregate([
      { 
          $match : {completionOfTask : {$gte : 50} }
      },
     
    ])
    res.status(200).json({
        data : task
    })
}
catch (err) {
    res.status(400).send(err)
} 
})

// action history

taskRouter.get('/actionhistory/:id', async(req, res) => {
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
taskRouter.post('/tags', async(req, res) => {
    try {
        const task = await Task.find(req.body)
        res.status(200).send(task)
    }
    catch (e) {
        res.status(404).send(err);
    }
})

// Get Tasks By percent of Completion
// taskRouter.post('/tasks', async (req, res) => {
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
taskRouter.get('/tasks/:id', async (req, res) => {
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

taskRouter.post('/Projects', async(req, res) => {
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
taskRouter.get('/Projects/:id', async (req, res) => {
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

taskRouter.post('/tasks', async (req, res) => {
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

taskRouter.post('/subtasks/:id', async (req, res) => {
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
taskRouter.get('/subtasks/:id', async (req, res) => {
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
taskRouter.patch('/subtasks/:id', async(req, res) => {
    
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

taskRouter.delete('/subtasks/:id', async(req, res) => {
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

taskRouter.patch('/tasks/:id', async(req, res) => {
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

taskRouter.delete('/tasks/:id', async(req, res) => {
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


module.exports = taskRouter;