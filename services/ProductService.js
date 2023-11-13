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
    GetOne(id) {
        const products = Product.findOne({_id: id})
        return products
    }

    Delete(id) {
        Product.findByIdAndDelete(id).then(() => {
            console.log(`Produto com a id: ${id} foi deletado.`)
        }).catch(err => {
            console.log(err)
        })
    }

    Update(id, name,price,category) {
        Product.findByIdAndUpdate(id, {
                name:name,
                price:price,
                category:category
        }).then(() => {
            console.log(`Dados do produto com id: ${id} alterados com sucesso.`)
        }).catch(err => {
            console.log(err)
        })
    }
}

export default new ProductService()
