import mongoose from "mongoose";

import product from "../models/Products.js"

const Product = mongoose.model("Product", product)

class ProductService{
    
    Create(name,price,category){
        const newProduct = new Product(
            {
                name:name,
                price:price,
                category:category
            }
        )
        newProduct.save()
    }

    GetAll(){
        const products = Product.find()
        return products
    }
}

export default new ProductService()
