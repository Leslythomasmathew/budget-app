import React from "react";
import { useRouteError, Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Frown } from "lucide-react";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-title">
        <Frown size={80} className="illustration-icon" />
      </div>
      <h2 className="error-subtitle">Oops! Something went wrong.</h2>
      <p className="error-text">
        {error.statusText || error.message || "We encountered an unexpected error. Please check your path or reload."}
      </p>
      <div className="error-actions">
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Go Back
        </button>
        <Link to="/" className="btn btn-primary">
          <Home size={18} />
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
