import mongoose from "mongoose"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'


const userSchema = new mongoose.Schema(
    {
       username:{
        type:String,
        required:true,
        unique:true
       },
       email:{
        type:String,
        required:true,
        unique:true
       },
       password:{
        type:String,
        required:true
       },
       avatar:{
        type:String
       },
       refresh_token:{
        type:String,
        
       }
},
    
    {timestamps:true}
)
   userSchema.pre("save" , async function (next){
    if(!this.isModified("password"))return next()
    this.password = await bcryptjs.hash(this.password,10)
    next()
   })
    userSchema.methods.isPasswordCorrect = async function (password){
        return await bcryptjs.compare(password,this.password)
    }


    userSchema.methods.generateAccessToken = async function(){
        return jwt.sign({
            _id:this._id,
            username:this.username,
            email:this.email
        },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}

        )}

   userSchema.methods.generateRefreshToken = async function (){
    return jwt.sign({
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
    
    )}



export const User = mongoose.model('User',userSchema)