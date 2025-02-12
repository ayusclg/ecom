import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"
import fs from 'fs'

// const generateAccessAndRefreshToken = async function(userId) {
//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             console.log('User not found');
//             return null; // or throw an error
//         }

//         const accessToken = await user.generateAccessToken();
//         const refreshToken = await user.generateRefreshToken();

//         console.log('gener',accessToken)
//         console.log('ref tijeb', refreshToken)

//         user.refresh_token = refreshToken;
//         await user.save({ validateBeforeSave: false });

//         return { accessToken, refreshToken };
//     } catch (error) {
//         console.log('Error occurred in generating token:', error);
//         return null; // handle error appropriately
//     }
// };


const generateAccessTokenOnly = async(userId)=>{
    try
    {
     const user = await User.findById(userId)
     const accessToken = await user.generateAccessToken()
        return accessToken;
    }
    catch(error){
     console.log("Error Occured in generating access Token")
    }
 }
 
 const generateRefreshTokenOnly = async(userId)=>{
     try {
         const user = await User.findById(userId)
         const refreshToken = await user.generateRefreshToken()
         user.refresh_token = refreshToken
          user.save({validateBeforeSave:false})
          return refreshToken
     } catch (error) {
         console.log("Error Occured in generating Refresh Token")
     }
 }

const userRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const photourl = req.file ? `public/images/${req.file.filename}` : "";

        const user = await User.create({
            username,
            email,
            password,
            avatar: photourl
        });

        const createdUser = await User.findById(user._id).select(" -password -refresh_token");
        if (!createdUser) {
            console.log('Error occurred in creating user');
            if(req.file){
                fs.unlink(req.file.path)
            }
            return res.status(500).json({
                message: "User not created"
            });
        }

        return res.status(201).json({
            message: "User created successfully",
            data: createdUser
        });
    } catch (error) {
        console.log('Error in registering:', error);
        if(req.file){
            fs.unlink(req.file.path)
        }
        return res.status(500).json({
            message: "User not registered"
        });
    }
};

const userLogin = async (req, res) => {
    try {
        
        const {email,password} = req.body
        
        if (!email) {
            console.log('Email is required');
        }

        const user = await User.findOne({ email:email });
        if (!user) {
            console.log('User does not exist');
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(404).json({
                message: 'Invalid credentials'
            });
        }
        
        //const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        const accessToken = await generateAccessTokenOnly(user._id);
        const refreshToken = await generateRefreshTokenOnly(user._id);
        
        
        if (!accessToken || !refreshToken) {
            return res.status(500).json({
                message: 'Failed to generate tokens'
            });
        }

        const loggedUser = await User.findById(user._id).select("-password -refresh_token");

        const options = {
            httpOnly: true,
            secure: true
        };

        res
        .status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: 'User logged in successfully',
                data: loggedUser
            });
    } catch (error) {
        console.log('Error in login:', error);
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

const userLogout = async (req, res) => {
    
    console.log(req.user._id)
    await User.findByIdAndUpdate(
        
      req.user._id,
      
      {
        $set: {
          refresh_token: undefined
        }
      },
      {
        new: true
      }
    )
    
  
    const options = {
      httpOnly: true,
      secure: true
    }
  
    return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json({
            message: 'User Logged Out Successfully',
            
        })
  }
  const getUser = async(req,res)=>{
    try {
        res.status(200).json({
            data: req.user,
            message:"user fetched successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'user not logged in'})
    }
 }
 
 const refreshTokenAcess = async (req,res)=>{
    try {
        const token = req.cookies?.refreshToken
        //console.log(token)
        if(!token){
            console.log("Token not accessed")
            res.status(401).json({
                message : "unauthorized access"
            })
        }

        const decodeToken = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
        //console.log(decodeToken)
        
        const user = await User.findById(decodeToken?._id).select("-password -refresh_token")
            //console.log(user)
        
        // if (token !== user["refreshToken"]) {
        //     console.log( "Refresh token is expired or used")
        //     res.status(401).json({
        //         message: 'token expired '
        //     })}

        const accessToken   = await generateAccessTokenOnly(user._id)
        const newRefreshToken = await generateRefreshTokenOnly(user._id)
        //console.log(newRefreshToken)

        const options ={
            httpOnly : true,
            secure :true
        }

        return res.status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",newRefreshToken,options)
            .json({
                message: "Access Token Generated Successfully",
                data : accessToken
            })


    } catch (error) {
        res.status(500).json({message:"Something Went Wrong in refreshTokenAcess"})
    }
 }

 const updateDetails = async (req,res)=>{
    try {
        const {username , email} = req.body
        if(username =="" || email==""){
            res.status(500).json({
                message: "validate the fields"
            })
        }
        const user = await User.findByIdAndUpdate(
            req.user?._id,{
                $set:{
                    username,
                    email
                }},
                {
                    new:true
                }
            
        ).select("-password -refreshToken")

        return res.status(200)
        .json({
            message:"fields updated",
            data : user
        })
    } catch (error) {
        console.log("account not updated")
        res.status(500).json(
            {
                message: error-message
            }
        )
    }
  }

  const updatePassword = async(req,res)=>{
    try {
        const {oldPassword,newPassword}= req.body
        //console.log(req.body)
        
         const user = await User.findById(req.user?._id)
          const isPasswordValid = await user.isPasswordCorrect(oldPassword)
        
         if(!isPasswordValid){
            return res.status(500).json({
                message: "password doesnt matched"
            })
         }
        

        user.password = newPassword
        await user.save({validateBeforeSave:false})

     return res.status(200).json({
        message: "your password Successfully changed"
     })

        
    } catch (error) {
        res.status(500).json({
            messsage:"error occured in updating Password"
        })
    }
  }

  const updateAvatar = async(req,res)=>{
    try {
        const existAvatar = req.file?.path
        if(!existAvatar){
            res.status(404).json({
                message:'avatar not found '
            })
        }
        const newPhotoUrl = req.file?`public/images/${req.file.filename}`:"";
        const user = await User.findByIdAndUpdate(req.user._id,{
            $set:{
                avatar:newPhotoUrl
            }

        },{
            new:true
        }).select("-password -refreshToken")
        if(!user){
            return res.status(500).json({
                message: "something went wrong"
            })
        }
        return res.status(200).json({
            message:"Avatar Updated Successfully"
        })

    } catch (error) {
        res.status(500).json({
            message:"Avatar Not Updated"
        })
    }
  }
  
export { userRegister, userLogin,userLogout, getUser,refreshTokenAcess,updateDetails,updatePassword,updateAvatar};
