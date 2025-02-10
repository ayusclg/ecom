import mongoose from "mongoose";
import { Product } from "./product.models";
import { User } from "./user.models";

const orderSchema = new mongoose.Schema({
    products:{
        type: [
            {
            Product_id:{
                type:mongoose.Types.ObjectId,
                ref: Product,
            },
            
            name:{
                type:String,
                required:true

            },
            price:{
                type:Number,
                min : 0,
                required:true
            },
            quantity:{
                type:Number,
                min:1,
                required:true
            },
            status:{
                type:String,
                enum:['pending','completed','rejected'],
                required:true,
                default:pending
            }
        }

    ],
    required:true,
    validate:{
        validator: function (value){
            return value.length>0
        },
        message: 'atleast one product needed '
    }
    
},
 created_by:{
    type:mongoose.Types.ObjectId,
    ref: User,
    required:true
 }
},
    {timestamps:true}
)

orderSchema.post("save",async function(order){
    for(let product of order.products)
        await Product.findByIdAndUpdate(product.Product_id,{
            $inc:{
                in_stock:-(product.quantity)
            }
        })
})

export const Order = mongoose.model("Order",orderSchema)


