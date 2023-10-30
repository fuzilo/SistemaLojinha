import mongoose from "mongoose"

const product = new mongoose.Schema(
    {
        name: String,
        price: Number,
        category: String
    }
)

export default product