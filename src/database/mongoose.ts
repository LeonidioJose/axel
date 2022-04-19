import mongoose from 'mongoose'

export default () => {
    mongoose.connect("mongodb+srv://AxelDB:jA1sy1mMYsicFQ5W@cluster0.os4s9.mongodb.net/AxelDB?retryWrites=true&w=majority",{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
    }).then(() => {
        console.log("[MONGODB] Connected")
    })
}