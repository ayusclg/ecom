import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"

export const VerifyToken = async (req, res, next) => {
  try {
    const token =  req.cookies?.accessToken;
    //console.log('access token',token)
    
    
    if (!token) {
      
      return res.status(401).json({
        message: "Unauthorized request"
      })
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password -refresh_token")
  

    if (!user) {
      res.status(404).json({
        message: "User not found"
      })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({
      message: error.message
    })
  }
}