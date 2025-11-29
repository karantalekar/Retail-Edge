import React from "react";
import StaffNavbar from "./StaffNavbar";

const StaffDashboard = () => {
  return (
    <div>
      <StaffNavbar />

      <div className="container py-4">
        {/* Header */}
        <div className="text-center mb-2">
          {/* <img
            src="https://cdn-icons-png.flaticon.com/512/3076/3076896.png"
            alt="Retail Edge Logo"
            style={{ width: "100px" }}
          /> */}
          <h1 className="text-primary fw-bold">Welcome to Retail Edge</h1>
          <p className="text-muted fs-5">
            Retail Edge is a smart billing and inventory management system
            designed for retailers to streamline their daily operations.
          </p>
        </div>

        {/* Information Section */}
        <div className="row align-items-center mb-5">
          <div className="col-md-4">
            <img
              src="https://cdn.pixabay.com/photo/2016/03/02/20/13/grocery-1232944_1280.jpg"
              alt="Retail System"
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-md-6">
            <h3 className="fw-bold text-secondary">Why Retail Edge?</h3>
            <ul className="fs-5">
              <li>Easy product management and billing</li>
              <li>Track stock in real-time</li>
              <li>Generate PDF invoices instantly</li>
              <li>Monitor sales and revenue effectively</li>
            </ul>
          </div>
        </div>

        <div className="row align-items-center">
          <div className="col-md-6 order-md-2">
            <img
              src="https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=400&q=80"
              alt="Analytics"
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-md-6 order-md-1">
            <h3 className="fw-bold text-secondary">Get Started Quickly</h3>
            <p className="fs-5 text-muted">
              Staff can easily add products to cart, generate bills, and help
              customers without complicated steps. Retail Edge ensures smooth
              operations with minimal effort.
            </p>
          </div>
        </div>

        {/* Footer */}
        {/* <footer className="bg-primary text-white text-center py-4 mt-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3076/3076896.png"
            alt="Retail Edge Logo"
            style={{ width: "50px", marginBottom: "5px" }}
          />
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Retail Edge. All rights reserved.
          </p>
        </footer> */}
      </div>
    </div>
  );
};

export default StaffDashboard;
