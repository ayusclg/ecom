import Router from "router";
import { VerifyToken } from "../middleware/auth.middleware.js";
import { addProduct, delProduct, fetchProduct } from "../controllers/product.controller.js";
import { Upload } from "../middleware/multer.middleware.js";

const router = Router()

router.route("/addProduct").post(Upload.single("image"),VerifyToken,addProduct)
router.route("/fetch").get(fetchProduct)
router.route("/delete/:_id").delete(VerifyToken,delProduct)
export default router