const mongooes = require("mongoose")
const dbConnected =async()=>{
   await mongooes.connect( "mongodb+srv://malikhaseeb456070:A97xZiknmsHiOoSH@cluster0.gly3v.mongodb.net/",
        { dbName: "Haseeb" })
       
        .then(()=>{           
        console.log("Mongo Db Connected");        
        }).catch((error)=>{
            console.log("error",error);
             })
            //  const result =  mongooes.connection.collection("users").dropIndex("userName_1");
            //  console.log("Index removed:", result);

}
module.exports= dbConnected;