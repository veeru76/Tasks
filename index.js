const express = require('express');
require('./db/mongoose')
const app = express();
const multer  = require('multer')
const taskRouter = require('./router/tasks.router');
const userRouter = require('./router/user.router')

process.env.PORT = 6000;
app.use(express.json());

app.get('/', async(req, res) => {
    res.status(200).send( "task manager app")
});


app.use(taskRouter)
app.use(userRouter)

app.listen(6000, () => {
    console.log('port connected')
})

module.exports = app;