import Router from "express";
import { Upload } from "../middleware/multer.middleware.js";
import {  getUser, refreshTokenAcess, updateDetails, userLogin, userLogout, userRegister ,updatePassword, updateAvatar} from "../controllers/user.controller.js";
import { VerifyToken } from "../middleware/auth.middleware.js";


const router = Router()

router.route("/register").post(Upload.single('avatar'),userRegister)
router.route("/login").post(userLogin)
router.route("/logout").post(VerifyToken,userLogout)
router.route("/getuser").get(VerifyToken,getUser)
router.route("/refresh").post(refreshTokenAcess)
router.route("/update").patch(VerifyToken,updateDetails)
router.route("/password").post(VerifyToken,updatePassword)
router.route("/Uavatar").patch(Upload.single("avatar"),VerifyToken,updateAvatar)
export default router