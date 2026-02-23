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
//   },
//   { timestamps: true }
// );
// const User = mongoose.model("User", userSchema);
// export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "staff"],
      default: "staff",
    },

    // ❗ Add approval field for staff verification
    approved: {
      type: Boolean,
      default: false, // staff cannot login until approved by admin
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
