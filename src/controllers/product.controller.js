import {Product} from '../models/product.models.js'
import { User } from '../models/user.models.js'
import path from 'path'
import fs from 'fs'
const addProduct = async(req,res)=>{
    try {
        const{title,description,price,category,in_stock}= req.body
        
         const imagePath =`public/images/${req.file.filename}`
         
        
    
        const admin = await User.findById(req.user._id)
        
        if(!admin.isAdmin){
            return res.status(401).json({
                message:"you are not admin"
            })
        }
        
        const productCreated = await Product.create({
            title,
            description,
            price,
            category,
            in_stock,
            image:imagePath
        })
        
        if (!productCreated) {
            return res.status(500).json({
              message: 'Something went wrong'
            })
          }
      
          
        return res.status(200).json({
            message: "Product added",
            data: productCreated
        })


    } catch (error) {
         res.status(500).json({
            message:"Product couldnot register",
            message: error
        })
    }
}
 const fetchProduct = async (req,res)=>{
    try {
        let page = parseInt(req.query.page) || 1
        let perPage = parseInt(req.query.perPage)|| 2
        let category = req.query.category

        let productFilter = {}
        if(category){
            productFilter.categories = category
        }

        const product = await Product.find(productFilter)
        .limit(perPage)
        .skip((page-1)*perPage)

        const totalProduct = await Product.countDocuments(productFilter)

            res.status(201).json({
                page:page,
                perPage,
                totalProducts : totalProduct,
                data : product
            }
        )
    } catch (error) {
        res.status(500).json({
            message: "Error occured in fetching products"
        })
    }
 }
const delProduct = async(req,res)=>{
    try {
        const admin = await User.findById(req.user._id)
        if(!admin){
            return res.status(401).json({
                message: "Admin Only Can Access"
            })
        }
        
        const product = await Product.findById(req.params._id)
        if(!product){
            return res.status(401).json({
                message:"Product Not Found"
            })
        }
        console.log(product)
        await Product.deleteOne({_id:req.params._id})
        if(product.image){
            
            const imagePath = path.join(path.resolve(),product.image)
            fs.unlink(imagePath,(err)=>{
                if(err){
                console.log("error occured in deleting photo")
        }})
        }
        res.status(200).json({
            message:"product successfully deleted"
        })
    } catch (error) {
        res.status(500).json({
            message: "error occured in deleting product",
            
        })
    }
}
const updateProduct = async (req,res)=>{
    try {
        const user = await User.findById(req.user._id)
        if(!user.isAdmin){
            return res.status(403).json({
                message:"admin is only allowed"
            })
        }
        const {title,description,price,in_stock,category} =req.body
        
    
        const up = await Product.findByIdAndUpdate({_id:req.params._id},{
            $set:{
                title,
                description,
                price,
                in_stock,
                category,
            }},
            {
                new:true
            }
        )
        if (!up){
            return res.status(401).json({
                message:"product not updated"
            })
        }
        res.status(200).json({
            message:"product successfully Updated"
        })
    } catch (error) {
        res.status(500).json({
            message: "error in updating product details"
        })
    }
}

const fetchSingleProduct = async (req,res)=>{
    try {
        
        const product = await Product.findById(req.params._id)
        if(!product){
            return res.status(404).json({
                message: "could not find the product"
            })
        }
        return res.status(200).json({
            message: "product found",
            data : product
        })
    } catch (error) {
        res.status(500).json({
            message:"could not fetch the product "
        })
    }
}
export {addProduct,fetchProduct,delProduct,updateProduct,fetchSingleProduct}
