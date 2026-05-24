// 404 Not Found Page
// Displayed when user navigates to non-existent route

import React from "react";
import { Link } from "react-router-dom";
import "../styles/NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>

          <div className="illustration">
            <div style={{ fontSize: "100px" }}>🔍</div>
          </div>

          <Link to="/" className="btn btn-primary">
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
