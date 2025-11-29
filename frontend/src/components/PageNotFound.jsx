import React from "react";
import { HouseDoorFill, ExclamationTriangleFill } from "react-bootstrap-icons";

const PageNotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-center">
      <div
        className="p-4 rounded-4 shadow-sm bg-white"
        style={{ maxWidth: "450px" }}
      >
        <ExclamationTriangleFill
          size={70}
          color="#dc3545"
          className="mb-3 animate-bounce"
        />
        <h1 className="display-4 fw-bold text-danger">404</h1>
        <h4 className="fw-semibold mb-2 text-dark">Oops! Page Not Found</h4>
        <p className="text-muted mb-4">
          The page you’re looking for doesn’t exist or was moved.
        </p>

        <a
          href="/"
          className="btn btn-primary d-flex align-items-center justify-content-center gap-2 px-4 py-2 rounded-pill shadow-sm"
        >
          <HouseDoorFill size={20} />
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default PageNotFound;
