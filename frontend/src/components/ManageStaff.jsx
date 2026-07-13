import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaCheckCircle, FaClock, FaKey, FaSearch, FaSyncAlt, FaTimes, FaTrash, FaUserCheck, FaUserPlus, FaUserSlash, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import api from "../config/api";
import ConfirmDialog from "./ConfirmDialog";
import "../style/AdminWorkspace.css";

const ManageStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [resetStaff, setResetStaff] = useState(null);
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [staffToDelete, setStaffToDelete] = useState(null);
  const navigate = useNavigate();

  const loadStaff = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true); else setLoading(true);
    try {
      const response = await api.get("/staff");
      const data = Array.isArray(response.data) ? response.data : response.data?.data || response.data?.staff || [];
      setStaffList(data);
      if (silent) toast.success("Staff list refreshed");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to load staff");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadStaff(); }, [loadStaff]);

  const metrics = useMemo(() => ({
    active: staffList.filter((staff) => staff.approved && staff.isActive !== false).length,
    inactive: staffList.filter((staff) => !staff.approved || staff.isActive === false).length,
    recovery: staffList.filter((staff) => staff.passwordResetRequestedAt).length,
  }), [staffList]);

  const visibleStaff = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return staffList.filter((staff) => {
      const active = staff.approved && staff.isActive !== false;
      const matchesQuery = !query || staff.fullname?.toLowerCase().includes(query) || staff.email?.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" && active) || (statusFilter === "inactive" && !active) || (statusFilter === "recovery" && staff.passwordResetRequestedAt);
      return matchesQuery && matchesStatus;
    });
  }, [searchTerm, staffList, statusFilter]);

  const updateStatus = async (staff, activate) => {
    setBusyId(staff._id);
    try {
      await api.patch(`/staff/${activate ? "approve" : "deactivate"}/${staff._id}`);
      setStaffList((current) => current.map((item) => item._id === staff._id ? { ...item, approved: activate } : item));
      toast.success(`${staff.fullname} ${activate ? "activated" : "deactivated"}`);
    } catch (error) {
      console.error(error);
      toast.error(`Unable to ${activate ? "activate" : "deactivate"} staff`);
    } finally { setBusyId(null); }
  };

  const handleDelete = async (staff) => {
    setBusyId(staff._id);
    try {
      await api.delete(`/staff/${staff._id}`);
      setStaffList((current) => current.filter((item) => item._id !== staff._id));
      setStaffToDelete(null);
      toast.success("Staff account deleted");
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete staff");
    } finally { setBusyId(null); }
  };

  const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(temporaryPassword);
  const submitPasswordReset = async (event) => {
    event.preventDefault();
    if (!passwordValid) return;
    setBusyId(resetStaff._id);
    try {
      await api.patch(`/staff/reset-password/${resetStaff._id}`, { password: temporaryPassword });
      setStaffList((current) => current.map((item) => item._id === resetStaff._id ? { ...item, passwordResetRequestedAt: null } : item));
      toast.success("Temporary password assigned");
      setResetStaff(null);
      setTemporaryPassword("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to reset password");
    } finally { setBusyId(null); }
  };

  return (
    <div className="admin-page">
      <Navbar />
      <main className="container-fluid px-3 px-lg-4 admin-main">
        <header className="admin-header">
          <div><span>TEAM OPERATIONS</span><h1>Manage staff</h1><p>Review access, account status, and password recovery requests.</p></div>
          <div className="admin-header-actions"><button className="btn btn-outline-secondary" onClick={() => loadStaff(true)} disabled={refreshing}><FaSyncAlt className={refreshing ? "admin-spin" : ""} /> Refresh</button><button className="btn btn-primary" onClick={() => navigate("/Registration")}><FaUserPlus /> Add staff</button></div>
        </header>

        <section className="admin-metrics staff-metrics">
          <article><span className="admin-metric-icon blue"><FaUsers /></span><div><p>Total staff</p><strong>{staffList.length}</strong><small>Registered accounts</small></div></article>
          <article><span className="admin-metric-icon teal"><FaUserCheck /></span><div><p>Active</p><strong>{metrics.active}</strong><small>Can access RetailEdge</small></div></article>
          <article><span className="admin-metric-icon amber"><FaUserSlash /></span><div><p>Inactive</p><strong>{metrics.inactive}</strong><small>Waiting or suspended</small></div></article>
          <article><span className="admin-metric-icon purple"><FaKey /></span><div><p>Recovery requests</p><strong>{metrics.recovery}</strong><small>Need administrator help</small></div></article>
        </section>

        <section className="admin-panel staff-panel">
          <div className="staff-toolbar">
            <label className="staff-search"><FaSearch /><input type="search" placeholder="Search staff by name or email" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /></label>
            <select className="form-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All accounts</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="recovery">Recovery requested</option></select>
          </div>
          <div className="staff-panel-title"><div><h2>Staff directory</h2><p>{visibleStaff.length} of {staffList.length} team members</p></div></div>
          {loading ? <div className="admin-loading"><div className="spinner-border text-primary" /><span>Loading staff…</span></div> : visibleStaff.length ? (
            <div className="table-responsive"><table className="table staff-table align-middle mb-0"><thead><tr><th>Team member</th><th>Joined</th><th>Account status</th><th>Password access</th><th className="text-end">Actions</th></tr></thead><tbody>{visibleStaff.map((staff) => {
              const active = staff.approved && staff.isActive !== false;
              const busy = busyId === staff._id;
              return <tr key={staff._id}><td><div className="staff-identity"><span>{staff.fullname?.charAt(0).toUpperCase() || "S"}</span><div><strong>{staff.fullname}</strong><small>{staff.email}</small></div></div></td><td>{staff.createdAt ? new Date(staff.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td><td><span className={`staff-status ${active ? "active" : "inactive"}`}>{active ? <FaCheckCircle /> : <FaClock />}{active ? "Active" : "Inactive"}</span></td><td>{staff.passwordResetRequestedAt ? <button className="recovery-request" onClick={() => { setResetStaff(staff); setTemporaryPassword(""); }}><FaKey /> Recovery requested</button> : <span className="access-ok">No open request</span>}</td><td><div className="staff-actions"><button className={`staff-toggle ${active ? "deactivate" : "activate"}`} disabled={busy} onClick={() => updateStatus(staff, !active)}>{active ? <FaUserSlash /> : <FaUserCheck />}{active ? "Deactivate" : "Activate"}</button><button className="staff-delete" disabled={busy} onClick={() => setStaffToDelete(staff)} aria-label={`Delete ${staff.fullname}`}><FaTrash /></button></div></td></tr>;
            })}</tbody></table></div>
          ) : <div className="admin-empty"><FaUsers /><strong>No staff found</strong><span>Try a different search or status filter.</span></div>}
        </section>
      </main>

      {resetStaff && <div className="admin-modal-backdrop" onMouseDown={() => setResetStaff(null)}><div className="admin-modal" onMouseDown={(event) => event.stopPropagation()}><button className="admin-modal-close" onClick={() => setResetStaff(null)}><FaTimes /></button><span className="admin-modal-icon"><FaKey /></span><h2>Reset staff password</h2><p>Assign a temporary password for <strong>{resetStaff.fullname}</strong>. Share it securely and ask them to sign in promptly.</p><form onSubmit={submitPasswordReset}><label><span>Temporary password</span><input className="form-control" type="password" value={temporaryPassword} onChange={(event) => setTemporaryPassword(event.target.value)} placeholder="Create a secure temporary password" autoFocus required /></label><small className={temporaryPassword && passwordValid ? "text-success" : "text-muted"}>Use 8+ characters with uppercase, lowercase, number, and symbol.</small><div className="admin-modal-actions"><button type="button" className="btn btn-outline-secondary" onClick={() => setResetStaff(null)}>Cancel</button><button className="btn btn-primary" disabled={!passwordValid || busyId === resetStaff._id}>Assign password</button></div></form></div></div>}
      <ConfirmDialog
        open={Boolean(staffToDelete)}
        variant="danger"
        title="Delete staff account?"
        description={staffToDelete ? `${staffToDelete.fullname}'s access and account will be permanently removed. This action cannot be undone.` : ""}
        confirmLabel="Delete staff"
        busyLabel="Deleting…"
        busy={Boolean(staffToDelete && busyId === staffToDelete._id)}
        onConfirm={() => handleDelete(staffToDelete)}
        onClose={() => setStaffToDelete(null)}
      >
        {staffToDelete && <div className="confirm-dialog-details"><div><span>Team member</span><strong>{staffToDelete.fullname}</strong></div><div><span>Email</span><strong>{staffToDelete.email}</strong></div></div>}
      </ConfirmDialog>
    </div>
  );
};

export default ManageStaff;
