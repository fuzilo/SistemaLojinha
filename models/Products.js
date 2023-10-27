import mongoose from "mongoose"

const product = new mongoose.Schema(
    {
        name: String,
        price: String,
        category: String
    }
)

export default product