import { Router } from 'express'
import { VerifyToken } from '../middleware/auth.middleware.js'
import { allOrder, createOrder , fetchUserOrder} from '../controllers/order.controller.js'


 const router = Router()

 router.route("/create").post(VerifyToken,createOrder)
 router.route("/allorder").get(VerifyToken,allOrder)
 router.route("/userOrder").get(VerifyToken,fetchUserOrder)

 export default router