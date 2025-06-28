import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import React, { useContext, useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const Menubar = () => {
  const navigate = useNavigate();
  const { userData, BASE_URL, setUserData, setIsLoggedIn} = useContext(AppContext);
  const [dropDownOpen, setDropdownOpen] = useState(false);
  const dropDownRef = useRef(null);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlelogout = async () => {
    try{
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      if (response.status === 200) {
        setIsLoggedIn(false);
        setUserData(false);
        navigate("/login");
      } else {
        toast.error("Logout failed");
        console.error("Logout failed");
      }
    }
    catch (error){
      toast.error(error?.response?.data?.message);
    }
  }
  
  const sendVerificationOtp = async() => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(BASE_URL + "/send-otp");
      if (response.status === 200) {
        navigate("/email-verify");
        toast.success("OTP has been sent successfully!");
      } else {
        toast.error("Failed to send verification OTP.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred while sending verification email.");
    }

  }
  return (
    <nav className="navbar bg-white px-5 py-4 d-flex justify-content-between align-items-center">
      
      <div className="d-flex align-items-center gap-2">
        <img src={assets.logo} alt="Logo" width={45} height={45} />
        <span className="fw-bold fs-4 text-dark">Authify</span>
      </div>

      {userData ? (
        <div className="position-relative" ref={dropDownRef}>
          <div
            className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center"
            style={{
              width: "40px",
              height: "40px",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            {userData?.name?.[0]?.toUpperCase() || "U"}
          </div>

          {dropDownOpen && (
            <div
              className="position-absolute shadow bg-light rounded p-2"
              style={{ top: "50px", right: "0", zIndex: 1000 }}
            >
              {userData?.isAccountVerified === false && (
                <div
                  className="dropdown-item py-1 px-2 text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={sendVerificationOtp}
                >
                  Verify Email
                </div>
              )}
              <div
                className="dropdown-item py-1 px-2 text-danger"
                style={{ cursor: "pointer" }}
                onClick={handlelogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="btn btn-outline-dark rounded-pill px-3"
          onClick={() => navigate("/login")}
        >
          Login <i className="bi bi-arrow-right ms-2"></i>
        </div>
      )}
    </nav>
  );
};

export default Menubar;

