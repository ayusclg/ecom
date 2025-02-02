import mongoose from "mongoose"
import bcryptjs from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'


const userSchema = new mongoose.Schema(
    {
       username:{
        type:String,
        required:true,
        unique:true
       },
       email:{
        type:String,
        require:true,
        unique:true
       },
       password:{
        type:String,
        required:true
       },
       avatar:{
        type:String,
        required:true,
       }
},
    
    {timestamps:true}
)
   userSchema.pre("save",async(next)=>{
    if(!this.isModfied("password") )return next()
    this.password = await bcryptjs.hash(this.password,10)
    next()
   })
    userSchema.methods.isPasswordCorrect = async function (password){
        return await bcryptjs.compare(password,this.password)
    }


    userSchema.methods.generateAcessToken = async function(){
        return jwt.sign({
            _id:this._id,
            username:this.username,
            email:this.email
        },
    process.env.ACESS_TOKEN_SECRET,
    {expiresIn:process.env.ACESS_TOKEN_EXPIRY}

        )}

   userSchema.methods.generateRefreshToken = async function (){
    return jwt.sign({
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
    
    )}



export const User = mongoose.model('User',userSchema)