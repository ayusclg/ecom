import Router from "express";
import { Upload } from "../middleware/multer.middleware.js";
import {  getUser, userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
import { VerifyToken } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/register").post(Upload.single('avatar'),userRegister)
router.route("/login").post(userLogin)
router.route("/logout").post(VerifyToken,userLogout)
router.route("/getuser").get(VerifyToken,getUser)
export default router