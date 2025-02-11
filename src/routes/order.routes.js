import { Router } from 'express'
import { VerifyToken } from '../middleware/auth.middleware.js'
import { allOrder, createOrder } from '../controllers/order.controller.js'


 const router = Router()

 router.route("/create").post(VerifyToken,createOrder)
 router.route("/allorder").get(VerifyToken,allOrder)

 export default router