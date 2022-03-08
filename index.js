const express = require('express');
require('./db/mongoose')
const app = express();

const taskRouter = require('./router/tasks.router');


process.env.PORT = 6000;
app.use(express.json());


app.use(taskRouter)

app.listen(6000, () => {
    console.log('port connected')
})