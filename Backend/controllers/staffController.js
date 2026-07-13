// import User from "../models/Users.js";

// // ─── Get All Staff ─────────────────────────────────────────────────────────
// export const getStaff = async (req, res) => {
//   try {
//     const staff = await User.find({ role: "staff" });
//     res.status(200).json(staff);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ─── Approve (Activate) Staff ──────────────────────────────────────────────
// export const approveStaff = async (req, res) => {
//   try {
//     const staff = await User.findById(req.params.id);
//     if (!staff) return res.status(404).json({ message: "Staff not found" });

//     staff.approved = true;
//     await staff.save();
//     res.status(200).json({ message: "Staff approved", staff });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ─── Deactivate Staff ──────────────────────────────────────────────────────
// export const deactivateStaff = async (req, res) => {
//   try {
//     const staff = await User.findById(req.params.id);
//     if (!staff) return res.status(404).json({ message: "Staff not found" });

//     staff.approved = false;
//     await staff.save();
//     res.status(200).json({ message: "Staff deactivated", staff });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ─── Delete Staff ──────────────────────────────────────────────────────────
// export const deleteStaff = async (req, res) => {
//   try {
//     const staff = await User.findByIdAndDelete(req.params.id);
//     if (!staff) return res.status(404).json({ message: "Staff not found" });

//     res.status(200).json({ message: "Staff deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import User from "../models/Users.js";
import bcrypt from "bcryptjs";

const validatePassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(
    password,
  );

// ─── Get All Staff ─────────────────────────────────────────────────────────
export const getStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" }).select("-password");

    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// ─── Approve (Activate) Staff ──────────────────────────────────────────────
export const approveStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await User.findById(id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    if (staff.role !== "staff") {
      return res.status(400).json({
        success: false,
        message: "User is not a staff member",
      });
    }

    staff.approved = true;
    await staff.save();

    res.status(200).json({
      success: true,
      message: "Staff approved successfully",
      data: {
        id: staff._id,
        fullname: staff.fullname,
        email: staff.email,
        approved: staff.approved,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// ─── Deactivate Staff ──────────────────────────────────────────────────────
export const deactivateStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await User.findById(id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    if (staff.role !== "staff") {
      return res.status(400).json({
        success: false,
        message: "User is not a staff member",
      });
    }

    staff.approved = false;
    await staff.save();

    res.status(200).json({
      success: true,
      message: "Staff deactivated successfully",
      data: {
        id: staff._id,
        fullname: staff.fullname,
        email: staff.email,
        approved: staff.approved,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// ─── Delete Staff ──────────────────────────────────────────────────────────
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await User.findById(id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    if (staff.role !== "staff") {
      return res.status(400).json({
        success: false,
        message: "User is not a staff member",
      });
    }

    await staff.deleteOne();

    res.status(200).json({
      success: true,
      message: "Staff deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

export const resetStaffPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!validatePassword(password || "")) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number and special character",
      });
    }

    const staff = await User.findOne({ _id: req.params.id, role: "staff" }).select(
      "+password",
    );
    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    staff.password = await bcrypt.hash(password, 10);
    staff.passwordResetRequestedAt = null;
    await staff.save();

    return res.status(200).json({
      success: true,
      message: "Temporary password assigned successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};
