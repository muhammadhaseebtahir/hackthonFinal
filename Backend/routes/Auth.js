// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcrypt")
// const Users = require("../models/authUser")

// const getRandomId = ()=>Math.random().toString(36).slice(2)+ Math.random().toString(36).slice(2)
// router.post("/register", async (req, res) => {
//   const { fullName, email, password } = req.body;
//   try {
//     const verifyedemail = Users.findOne({email})
//     if(verifyedemail){return res.status(404).json({message:"Email already exist,"})}
//       const hashPassword = await bcrypt.hash(password,10)
     
//       const userData = {user_id:getRandomId(),fullName,  email, password:hashPassword } 
//      const user = await Users(userData)
//      user.save()
//       res.status(201).json({ message: "User created successfully" ,user});
   
   
//      console.log("fullName", fullName);
//      console.log("email", email);
//     console.log("password", password);

//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });
// router.post("/login",async(req,res)=>{
//     const {email,password}= req.body
//     try{
//         const user =await Users.findOne({email})
//         if(!user){return res.status(404).json({message:"User not found"})}
//       const match=  await bcrypt.compare(password,user.password)     
        
    
//     if(match){
//         const {user_id}= user
        
//         res.status(201).json({message:"User Successfuly Login",user})
//     }else{
//         return res.status(404).json({message:"Password is incorrect"})

//     }

// }
//     catch(error){
//         res.status(500).json({error})
//     }

// })
// module.exports = router;



// const express = require("express")
// const bcrypt = require("bcrypt")
// const jwt = require("jsonwebtoken")
// const Users = require("../models/authUser")
// const verifyToken = require("../middlewares/auth")

// const router = express.Router()

// const getRandomId = () => Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)

// router.post("/register", async (req, res) => {

//     const { fullName, email, password } = req.body

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10)

//         const userData = { user_id: getRandomId(), fullName, email, password: hashedPassword,status:["customer"] }

//         const user = await Users(userData)
//         user.save()
//         const token = jwt.sign({ user_id: user.user_id }, "secret-key", {
//                  expiresIn: "1h",
//             });
//         res.status(201).json({ message: "User created successfully", user })
//     } catch (error) {
//         res.status(500).json({ error })
//     }
// })
// router.post("/login", async (req, res) => {

//     const { email, password } = req.body

//     try {

//         const user = await Users.findOne({ email })
//         if (!user) { return res.status(404).json({ message: "User not found" }) }

//         const match = await bcrypt.compare(password, user.password)


//         if (match) {

//             const { user_id } = user

//             const token = jwt.sign({ user_id }, "secret-key", { expiresIn: "30s" })

//             res.status(200).json({ message: "User loggedin successfully", token })
//         } else {
//             return res.status(404).json({ message: "Password is incorrect" })
//         }


//     } catch (error) {
//         console.error(error)
//         res.status(500).json({ error })
//     }
// })
// router.get("/user", verifyToken, async (req, res) => {

//     const user_id = req.user_id

//     try {

//         const user = await Users.findOne({ user_id })
//         if (!user) { return res.status(404).json({ message: "User not found" }) }

//         res.status(200).json({ user })


//     } catch (error) {
//         console.error(error)
//         res.status(500).json({ error })
//     }
// })

// module.exports = router




const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Users = require("../models/authUser")
const verifyToken = require("../middlewares/auth")

const router = express.Router()

const getRandomId = () => Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)

router.post("/register", async (req, res) => {
    const { fullName, email, password } = req.body

    try {
        // Check if email already exists
        const existingUser = await Users.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user data
        const userData = { user_id: getRandomId(), fullName, email, password: hashedPassword }

        // Save user to database
        const user = new Users(userData)
        await user.save()

        // Generate token
        const token = jwt.sign({ user_id: user.user_id }, "secret-key", { expiresIn: "1h" })

        // Send success response with token
        res.status(201).json({ message: "User created successfully", token, user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await Users.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const match = await bcrypt.compare(password, user.password)

        if (match) {
            const { user_id } = user

            // Generate token
            const token = jwt.sign({ user_id }, "secret-key", { expiresIn: "1h" })

            res.status(200).json({ message: "User logged in successfully", token })
        } else {
            return res.status(401).json({ message: "Password is incorrect" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
})

router.post("/forgot-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
      // Check if the user exists
      const user = await Users.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Ensure `newPassword` is provided
      if (!newPassword || newPassword.trim() === "") {
          return res.status(400).json({ message: "New password is required" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
      console.error("Error updating password:", error);
      return res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/user", verifyToken, async (req, res) => {
    const user_id = req.user_id

    try {
        const user = await Users.findOne({ user_id })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({ user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
})

module.exports = router
