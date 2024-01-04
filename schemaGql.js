import { gql } from "apollo-server-express";

const typeDefs = gql `

type Query {
    users : [User]
    user (_id: ID!) : User
    post (by: ID!) : [Post]
    postById (_id: ID!) : Post
    posts : [postWithName]
    allPost : [Post]
    myprofile : User
}

type postWithName {
    _id : ID!
    post : String
    by : IdName
}

type IdName {
    _id : String
    name : String
}

type User {
    _id : ID!
    name : String!
    email : String!
    password : String!
    website : String!
    posts : [Post]
}

type Post {
    _id : ID!
    by : ID!
    post : String!
}

type Token {
    token : String!
}


type Mutation {
    signUpuser( newUser : createUser! ) : User
    signUInUser( signInUser : SignInUser! ) : Token
    createPost ( post : String! ) : String
    updatePost ( UpdatePost : UpdatePost! ) : Post
    delUser ( _id : ID! ) : User
    updateUser ( UpdateUser : UpdateUser! ) : User
    delPost ( _id : ID! ) : Post
}

input UpdatePost {
    _id : ID!
    post : String
}

input UpdateUser {
    _id : ID!
    name : String!
    email : String!
    password : String!
    website : String!
}

input createUser {
    name : String!
    email : String!
    password : String!
    website : String!
}

input SignInUser {
    email : String!
    password : String!
}


`

export default typeDefs;