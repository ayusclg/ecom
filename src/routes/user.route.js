import Router from "express";
import { Upload } from "../middleware/multer.middleware.js";
import { userLogin, userRegister } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(Upload.single('avatar'),userRegister)
router.route("/login").post(userLogin)

export default router