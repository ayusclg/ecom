import mongoose from "mongoose";


const productSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        price:{
            type:String,
            required:true
        },
        review:{
            type:String,
            
        },
        image:{
            type:String,
            required:true
        },
        category:{
            type:String,
            enum:["Men","Women","Children"],
            required:true
        },
        in_stock:{
            type:Number,
            default:0,
            required:true
        }
},
    {Timestamp:true})

    export const Product = mongoose.model("Product",productSchema)


