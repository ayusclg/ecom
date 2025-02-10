import { Order } from "../models/order.models.js"
import { Product } from "../models/product.models.js"
import { User } from "../models/user.models.js"

const createOrder = async (req,res)=>{
    try {
        const admin = await User.findById(req.user._id)
        if(admin .isAdmin){
            return res.status(403).json({
                message:"forbidden request"
            })
        }

        const mapped_products =[]
        for(let product of req.body.products){
            const dbProduct = await Product.findById(product.product_id)
            mapped_products.push({
                product_id:dbProduct._id,
                name:dbProduct.title,
                price:dbProduct.price,
                quantity:product.quantity
            })
        }

        const creOrder = await Order.create({
            products:mapped_products,
            created_by:req.user._id
        })
        if(!creOrder){
            return res.status(500).json({
                message:"couldnot create order"
            })
        }
        res.status(200).json({
            message:"Order Successfully Created "
        })
    } catch (error) {
        res.status(500).json({
            message :"Error Occcured In creating Order"
        })
    }
}
export {createOrder}