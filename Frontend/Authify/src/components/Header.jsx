// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const Header = () => {
  const {userData} = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="text-center py-5 px-3 d-flex flex-column align-items-center ">
      <img
        src={assets.verified_account}
        alt="Logo"
        width={300}
        className="logo"
      />
      <h3 className="fw-bold">
        Hey {userData ? userData.name: 'Developer'}{""}
        <span role="img" aria-label="wave">
          👋
        </span>
      </h3>
      <h1 className="fw-bold display-5 mb-3">Welcome to Our Product</h1>
      <p className="text-muted fs-5 mb-4" style={{ maxWidth: "500px" }}>
        Let’s start with a quick product tour and you can setup the
        authentication in no time
      </p>
      <Link to="/login">
  <button className="btn btn-outline-dark rounded-pill px-4 py-2">
    Get Started
  </button>
</Link>
    </div>
  );
};
export default Header;
