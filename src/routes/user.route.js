import Router from "express";
import { Upload } from "../middleware/multer.middleware.js";
import {  getUser, refreshTokenAcess, userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
import { VerifyToken } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/register").post(Upload.single('avatar'),userRegister)
router.route("/login").post(userLogin)
router.route("/logout").post(VerifyToken,userLogout)
router.route("/getuser").get(VerifyToken,getUser)
router.route("/refresh").post(refreshTokenAcess)
export default router