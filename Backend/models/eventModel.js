// const mongoose= require("mongoose")
// const productSchema = new mongoose.Schema(
//     {
//       productName: {
//         type: String,
//         required: true,
//       },
//       description: {
//         type: String,
//         required: true,
//       },
//       type: {
//         type: String,
//         required: true,
//       },
//       price: {
//         type: Number,
//         required: true,
//       },
//       sizes: {
//         type: [String],  
//         required: true,  
//       },
//       userId: {
//         type: String,
//           },
//       productId: {
//         type: String,
//               },
//       imageUrl: {
//         type: String,
//         required: true,
//       },
//     },
//     {
//       timestamps: true, 
//     }
//   );
  
//   const AddProduct = mongoose.model('newProduct', productSchema);
  
//   module.exports = AddProduct;
  


const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    eventId:{
      type: String,
    },
    visibility: {
      type: [String],

      default: "public", // Default value is "public"
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
