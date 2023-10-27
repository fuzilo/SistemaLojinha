import mongoose from "mongoose";
import order from "../models/Orders.js"

const Order = mongoose.model("Order", order)

class OrderService{

    Create(code, total){
        const newOrder = new Order(
            {
                code:String,
                total:String
                //Estou criando os valores como string mesmo, depois alteramos, já que teremos de alterar as regras de negócio, interligando produto,cliente e pedido
            }
        )
        newOrder.save()
    }

    GetAll(){
        const orders = Order.find()
        return orders
    }
}

export default new OrderService()