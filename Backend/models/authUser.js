const mongooes =require("mongoose")



const userSchema = new  mongooes.Schema({
    user_id:{type:String,required:true,unique:true},
    fullName:{type:String},
        email:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        status:{type:String,default:"active"},
        role:{type:[String],default:["customer"]},

},{timestamps:true})

 const User = mongooes.model("user",userSchema)
 module.exports =User