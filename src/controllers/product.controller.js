import {Product} from '../models/product.models.js'
import { User } from '../models/user.models.js'
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
export {addProduct,fetchProduct}