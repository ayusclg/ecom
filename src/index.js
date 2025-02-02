import express from "express"
import connectDb from './database/index.js';
import dotenv from 'dotenv'
import { userRegister } from "./controllers/user.controller.js";
import router from "./routes/user.route.js";

const app = express ()
const port = process.env.port || 3000
const host = '127.0.0.1'


//middlewares
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static('public'))
app.use(cookieParser())

dotenv.config()
connectDb()
    .then((res)=>{
        app.listen(port,()=>{
            console.log(`youre running on :http://${host}:${port}`)
        })
    })
    .catch((err)=>{
        console.log('error occured in connection ',err)
    })


app.use("/api/v1/auth",userRegister)