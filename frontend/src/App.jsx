import "./App.css";
import Registration from "./components/Registration";
import Login from "./components/Login";
import Analytics from "./components/Analytics";
import PageNotFound from "./components/PageNotFound";
import { Routes, Route } from "react-router-dom";
import Addproduct from "./components/Addproduct";
import Cart from "./components/Cart";
import Report from "./components/Report";
import GenerateBill from "./components/GenerateBill";
import PrivateRoute from "./Context/PrivateRoute";
import ManageStaff from "./components/ManageStaff";
import ManageAdmin from "./components/ManageAdmin";
import Dashboard from "./components/Dashboard";
import AdminRegister from "./components/AdminRegister";
import StaffSettings from "./components/StaffSettings";

// 🔔 Toast imports (ADDED)
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style/PastelTheme.css";

function App() {
  return (
    <div>
      {/* 🔔 Toast Container (GLOBAL) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <Routes>
        {/* 🟢 Public Routes */}
        {/* <Route path="/" element={<Registration />} /> */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/Login" element={<Login />} />

        {/* 🔒 Admin Only Routes */}

        <Route path="/admin-register" element={<AdminRegister />} />

        <Route
          path="/Analytics"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Analytics />
            </PrivateRoute>
          }
        />
        <Route
          path="/Addproduct"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Addproduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/Report"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Report />
            </PrivateRoute>
          }
        />
        <Route
          path="/Registration"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Registration />
            </PrivateRoute>
          }
        />
        <Route
          path="/ManageStaff"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <ManageStaff />
            </PrivateRoute>
          }
        />
        <Route
          path="/ManageAdmin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <ManageAdmin />
            </PrivateRoute>
          }
        />
        {/* 🧑‍💼 Staff + Admin Routes */}
        <Route
          path="/Generatebill"
          element={
            <PrivateRoute allowedRoles={["staff", "admin"]}>
              <GenerateBill />
            </PrivateRoute>
          }
        />
        <Route
          path="/Cart"
          element={
            <PrivateRoute allowedRoles={["staff", "admin"]}>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/StaffSettings"
          element={
            <PrivateRoute allowedRoles={["staff", "admin"]}>
              <StaffSettings />
            </PrivateRoute>
          }
        />

        {/* 🚫 Fallback */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
