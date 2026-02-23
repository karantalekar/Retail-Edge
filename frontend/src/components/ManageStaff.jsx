import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { toast } from "react-toastify";

const ManageStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch staff from backend
  const fetchStaffList = async () => {
    try {
      const res = await axios.get(
        "https://retail-edge-plw7.onrender.com/api/staff",
      );
      setStaffList(res.data);
    } catch (error) {
      toast.error("Error fetching staff list");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, []);

  // Staff actions
  const handleActivate = async (id) => {
    try {
      await axios.patch(
        `https://retail-edge-plw7.onrender.com/api/staff/approve/${id}`,
      );
      toast.success("Staff activated");
      fetchStaffList();
    } catch (error) {
      toast.error("Error activating staff");
      console.error(error);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await axios.patch(
        `https://retail-edge-plw7.onrender.com/api/staff/deactivate/${id}`,
      );
      toast.info("Staff deactivated");
      fetchStaffList();
    } catch (error) {
      toast.error("Error deactivating staff");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;

    try {
      await axios.delete(
        `https://retail-edge-plw7.onrender.com/api/staff/${id}`,
      );
      toast.success("Staff deleted");
      fetchStaffList();
    } catch (error) {
      toast.error("Error deleting staff");
      console.error(error);
    }
  };

  // Filter staff by search
  const filteredStaff = staffList.filter(
    (staff) =>
      staff.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <Navbar />

      <div className="container py-5 mt-5">
        <h2 className="text-center text-primary fw-bold mb-4">
          👥 Manage Staff
        </h2>

        {/* ---------- SEARCH BAR ---------- */}
        <div className="d-flex justify-content-end mb-3">
          <input
            type="text"
            placeholder="🔍 Search by name or email"
            className="form-control w-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ---------- STAFF TABLE ---------- */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white fw-bold">
            📝 Staff List
          </div>

          <div className="card-body table-responsive">
            {filteredStaff.length > 0 ? (
              <table className="table table-striped align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((staff, index) => (
                    <tr key={staff._id}>
                      <td>{index + 1}</td>
                      <td>{staff.fullname}</td>
                      <td>{staff.email}</td>
                      <td>
                        {staff.approved ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-secondary">Inactive</span>
                        )}
                      </td>
                      <td className="d-flex gap-2">
                        {staff.approved ? (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleDeactivate(staff._id)}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleActivate(staff._id)}
                          >
                            Activate
                          </button>
                        )}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(staff._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-muted mb-0">No staff found.</p>
            )}
          </div>
        </div>

        {/* ---------- FOOTER ILLUSTRATION ---------- */}
        <div className="text-center mt-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Staff illustration"
            width="120"
            className="opacity-75"
          />
        </div>
      </div>
    </div>
  );
};

export default ManageStaff;
