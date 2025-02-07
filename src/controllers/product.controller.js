import {Product} from '../models/product.models.js'
const addProduct = async(req,res)=>{
    try {
        const{title,description,price,category,in_stock}= req.body

        imagePath = req.file?`public/images/${req.file.filename}`:"";
        const admin = await Product.findById(req.user._id)

        if(!admin.isAdmin){
            return res.status(401).json({
                message:"you are admin"
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
            data:productCreated
        })


    } catch (error) {
        return res.status(500).json({
            message:"Product couldnot register"
        })
    }
}

export {addProduct}