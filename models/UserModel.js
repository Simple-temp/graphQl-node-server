import mongoose from "mongoose";

const userSchema = (
    {
        name : { type: String , require : true },
        email : { type : String , require : true },
        password : { type: String , require : true },
        website : { type : String , require : true },
    }
)

mongoose.model("User", userSchema)