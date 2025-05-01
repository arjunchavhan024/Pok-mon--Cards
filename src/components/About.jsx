import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="container" style={{ height: "90vh" }}>
      <div className="row">
        <h1>About Page...Work in progress...</h1>
        <div className="col">
          <div className="card-footer text-center">
            <Link to="/" className="btn btn-outline-primary">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
