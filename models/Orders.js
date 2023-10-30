import mongoose from "mongoose";

const order = new mongoose.Schema(
    {
        code: Number,
        total: Number
    }
)

export default order