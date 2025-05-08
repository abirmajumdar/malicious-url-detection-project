const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

const authRoute = require('./routes/authRoute')
const showurlRoute= require('./routes/showUrlRoute')


const app = express()
dotenv.config()
app.use(express.json())
app.use(cors())


const PORT = process.env.PORT || 5000;

app.listen(PORT , ()=>{
    console.log('server is running ..'+ PORT)
})
// app.use("/",(req,res)=>{
//     res.status(200).json({"message":"running"})
// })


mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("database connected")
}).catch((e)=>{
    console.log(e)
})

app.use('/auth',authRoute)
app.use('/url',showurlRoute)
