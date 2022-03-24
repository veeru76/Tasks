const request = require('supertest');
const app = require('../index');
const jwt = require('../jwt');
const User = require('../models/user.model');
const mongoose = request("mongoose");
const user = require('../models/user.model');

var Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

console.log(require('util').inspect(Schema.Types.ObjectId));
const userOne = {
    _id : ObjectId,
    name : "veer",
    email : "veer@gmail.com",
    password : "veer@123",
    confirmPassword : "veer@123",
    tokens : [{
      token : jwt.sign({ _id : user_id}, process.env.JWT_SECRET)
    }] 
}

beforeEach(async() => {
    await user.deleteMany();
    await new user(userOne).save()
})



test('Should signup a new user', async() => {
    await request(app).post('/signup').send({
        "name" :  "veeranjane",
       "email" :  "pveeru440@gmail.com",
     "password":  "veeru@123",
"confirmPassword" : "veeru@123"
    }).expect(400)
})

test('Should login user', async() => {

    await request(app).post('/login').send({
       "email" :  "pveeru440@gmail.com",
     "password":  "veeru@123"
    }).expect(200)
})

test('Should not login user', async() => {
    
    await request(app)
    .post('/login').send({
       "email" :  "pveru440@gmail.com",
     "password":  "veeru@123"
    }).expect(400)
})

test("Should get all the tasks", async() => {
    await request(app)
    .post('/tasks')
    .set('Authrization', `Bearer ${user.tokens[0].token}`)
    .expect(200)
})