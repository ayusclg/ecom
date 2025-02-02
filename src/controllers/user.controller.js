import { User } from "../models/user.models.js"



const generateAcessAndRefreshToken = async function(userId){
    try {
        const user = await User.findById(userId)

        const acessToken = user.generateAcessToken()
        const refreshToken = user.generateRefreshToken()

        user.refresh_token = refreshToken
        user.save({validateBeforeSave :false})
        return {acessToken,refreshToken}


    } catch (error) {
        console.log('error occured in generating token')
    }
}
const userRegister = async function (req,res){
    try {
        
        const {username,email,password} =req.body


        const userExist = await User.findOne({email,})
        if(userExist){
            res.status(409).json({
                message: "user exist"
            })
        }

    const photourl = `/public/images/${req.file.filename}`
    const user = await User.create({
        username,
        email,
        password,
        avatar: photourl
    })

    const createdUser = await User.findById(user._id).select("-password -refresh_token")
    if (!createdUser){
        console.log('error occured in creating user')
        res.status(500).json({
            message:"user not created "
        })
    }

    return res.status(201).json({
        message: "user created sucessfully "
    })
        
    } catch (error) {
        console.log('error in registering ',error)
        res.status(500).json({
            message: "user not registered"
        })
    }

}


const userLogin = async function (req,res){
try{
    const {email,password} =req.body

    if(!email){
        console.log('email is required')
    }

    const userCheck = await User.findOne({email,})
    if(!usercheck){
        console.log('user doesnt exist')
        res.status(404).json({
            message:'user not found'
        })
    }

    const isPasswordValid = user.isPasswordCorrect(password)
    if(!isPasswordValid){
        res.status(404).json({
            message: 'invalid credentials'
        })
    }
    const {acessToken,refreshToken} = await generateAcessAndRefreshToken(userId)
    console.log('acess token',acessToken)
    console.log('refresh token',refreshToken)

    const loggedUser = await User.findById(user._id).select("-password -refresh_token")

    const options ={
        httpOnly : true,
        secure:true
    }

    res
        .status(201)
        .cookies("acessToken",acessToken,options)
        .cookies("refreshToken",refreshToken,options)
        .json({
            message:'user logged in successfully'
        })
}
    catch(error){
    res.status(500).json({
        message:'something went wrong'
    })
}}
export {userRegister,userLogin}