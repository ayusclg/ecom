import mongoose from "mongoose";


const productSchema = new mongoose.schema(
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
            enum:[clothes,electronics,household,makeup],
            required:true
        }
},
    {Timestamp:true})

    export const Product = mongoose.model("Product",productSchema)