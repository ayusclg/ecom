import Router from "express";
import { Upload } from "../middleware/multer.middleware.js";
import {  getUser, refreshTokenAcess, updateDetails, userLogin, userLogout, userRegister ,updatePassword, updateAvatar} from "../controllers/user.controller.js";
import { VerifyToken } from "../middleware/auth.middleware.js";
import Joi from 'joi'
import validator from "express-joi-validation "

const router = Router()
const validate = validator.createValidator()

const validationRegisterSchema = Joi.object({
    username : Joi.string().min(4).required(),
    email : Joi.string().email().required(),
    password: Joi.string().min(8).max(14).required().pattern(new RegExp("^(?=.*[^a-zA-Z0-9])(?=.*[A-Z])(?=.*\\d).{8,}$")).messages({
        "string.pattern.base": "Password must include at least one special character, one uppercase letter, and one digit."
      })
    })
    

router.route("/register").post(Upload.single('avatar'),validate.body(registerValidationSchema),userRegister)
router.route("/login").post(userLogin)
router.route("/logout").post(VerifyToken,userLogout)
router.route("/getuser").get(VerifyToken,getUser)
router.route("/refresh").post(refreshTokenAcess)
router.route("/update").patch(VerifyToken,updateDetails)
router.route("/password").post(VerifyToken,updatePassword)
router.route("/Uavatar").patch(Upload.single("avatar"),VerifyToken,updateAvatar)



export default router