// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     fullname: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },

//     role: {
//       type: String,
//       enum: ["admin", "staff"],
//       default: "staff",
//     },

//     // ❗ Add approval field for staff verification
//     approved: {
//       type: Boolean,
//       default: false, // staff cannot login until approved by admin
//     },
//   },
//   { timestamps: true },
// );

// const User = mongoose.model("User", userSchema);
// export default User;

import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, //  never return password by default
    },

    role: {
      type: String,
      enum: ["admin", "staff"],
      default: "staff",
    },

    //  Unique token for each user
    userToken: {
      type: String,
      unique: true,
      default: uuidv4,
    },

    // Staff approval system
    approved: {
      type: Boolean,
      default: false,
    },

    // Optional: account status (future use)
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
