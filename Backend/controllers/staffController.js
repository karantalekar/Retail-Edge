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
