import mongoose from "mongoose";

const order = new mongoose.Schema(
    {
        code: String,
        total:String
    }
)

export default order