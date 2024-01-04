import mongoose from "mongoose";

const postSchema = (
    {
        by: { type: mongoose.Schema.Types.ObjectId, ref : "User" },
        post: { type: String, require: true }
    }
)


mongoose.model("Post", postSchema)