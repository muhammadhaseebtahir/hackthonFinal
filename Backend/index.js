const express = require("express")

const bodyParser = require("body-parser")
const app = express()
const dbConnected= require("./config/db")
const cors = require("cors")
const auth = require("./routes/Auth")
const dashboard = require("./routes/Products")
app.use(cors())
app.use(bodyParser.json())
require("dotenv").config();
dbConnected()
app.get("/",(req,res)=>{
    res.send("hello hoe are you")
})
const {PORT=8000} = process.env
app.listen(PORT,()=>{
    console.log(`Server is Runing  ${PORT}`);
    
})
app.use("/auth",auth)
app.use("/dashboard",dashboard)


