import "./App.css";
import Registration from "./components/Registration";
import Login from "./components/Login";
import Home from "./components/Home";
import PageNotFound from "./components/PageNotFound";
import { Routes, Route } from "react-router-dom";
import Addproduct from "./components/Addproduct";
import Cart from "./components/Cart";
import Report from "./components/Report";
import StaffDashboard from "./components/StaffDashboard";
import GenerateBill from "./components/GenerateBill";
import PrivateRoute from "./Context/PrivateRoute";

function App() {
  return (
    <div>
      <Routes>
        {/* 🟢 Public Routes */}
        <Route path="/" element={<Registration />} />
        <Route path="/Login" element={<Login />} />

        {/* 🔒 Admin Only Routes */}
        <Route
          path="/Home"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Home />
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

        {/* 🧑‍💼 Staff + Admin Routes */}
        <Route
          path="/Staffdashboard"
          element={
            <PrivateRoute allowedRoles={["staff", "admin"]}>
              <StaffDashboard />
            </PrivateRoute>
          }
        />
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

        {/* 🚫 Fallback */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
