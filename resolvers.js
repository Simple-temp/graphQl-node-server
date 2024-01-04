import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import mongoose from "mongoose"


const User = mongoose.model("User")
const Post = mongoose.model("Post")

const resolvers = {
    Query: {
        users: async () => await User.find({}), //users,
        user: async (_, { _id }) => await User.findOne({ _id }),//users.find ( (x) => x._id == _id ),
        posts: async () => await Post.find({}).populate("by", "_id name"),
        post: async (_, { by }) => await Post.find({ by }),// posts.filter ( (x) => x.by == by )
        postById: async(_, { _id }) => await Post.findOne({ _id }),//postById.find ( (x) => x._id == _id ),
        allPost: async () => await Post.find(),//allPost
        myprofile: async (_,args,{userId}) =>{
            if (!userId) throw new Error("you must be login")
            return await User.findOne({_id: userId})
        },

    },
    User: {
        posts: async (user) => await Post.find({ by: user._id }) // posts.filter( (x) => x.by == user._id )
    },
    Mutation: {
        signUpuser: async (_, { newUser }) => {
            const user = await User.findOne({ email: newUser.email })
            if (user) {
                throw new Error(" This user already exits ")
            }

            const hashPassword = await bcrypt.hash(newUser.password, 12)

            const NewUser = new User({
                ...newUser,
                password: hashPassword
            })

            return await NewUser.save()
        },

        signUInUser: async (_, { signInUser }) => {

            const user = await User.findOne({ email: signInUser.email })
            if (!user) {
                throw new Error(" This email dosen't exits ")
            }

            const doMatch = await bcrypt.compare(signInUser.password, user.password)
            if (!doMatch) {
                throw new Error("email or password invalid")
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN)

            return { token }

        },

        createPost: async (_, { post }, { userId }) => {

            if (!userId) throw new Error("you must be login")

            const newPost = new Post({
                by: userId,
                post
            })

            await newPost.save()
            return "post save succesfully"

        },

        delUser: async (_, { _id }, { userId }) => {

            if (!userId) throw new Error("you must be login")

            const deleteUser = await User.findById({ _id })
            console.log(_id)

            await deleteUser.deleteOne()

        },

        delPost: async (_, { _id }, { userId }) => {

            if (!userId) throw new Error("you must be login")

            const deletePost = await Post.findById({ _id })
            console.log(_id)

            await deletePost.deleteOne()
        },

        updateUser: async (_, { UpdateUser }, { userId }) => {

            if (!userId) throw new Error("you must be login")

            console.log(UpdateUser)

            const user = await User.findById({ _id: UpdateUser._id })

            if (user) {
                user.name = UpdateUser.name || user.name
                user.email = UpdateUser.email || user.email
                if (UpdateUser.password) {
                    user.password = bcrypt.hashSync(UpdateUser.password, 12) || user.password
                }
                user.website = UpdateUser.website || user.website

                await user.save()

            }
        },
        updatePost : async (_, { UpdatePost }, { userId }) => {

            if (!userId) throw new Error("you must be login")

            console.log(UpdatePost)

            const Userpost = await Post.findById({ _id: UpdatePost._id })

            if (Userpost) {
                Userpost.post = UpdatePost.post || Userpost.post

                await Userpost.save()

            }
        },
    }
}

export default resolvers;