import React, { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";


const ResetPassword = () => {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const { getUserData, isLoggedIn, userData, BASE_URL } = useContext(AppContext);

  axios.defaults.withCredentials = true;

   const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, ''); 
    e.target.value = value;
    if (value && index < 5) {
      inputRefs.current[index + 1].focus(); 
    }
  }

  const handleKeyDown = (e,index) =>{
    if(e.key === "Backspace" && index > 0 && !e.target.value) {
      inputRefs.current[index - 1].focus(); 
    }
  }
  
  const handlePaste = (e) =>{
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6); 
    const inputs = pasteData.split('');
    
    inputs.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
        inputRefs.current[index].dispatchEvent(new Event('input', { bubbles: true })); 
      }
    });
    const next = pasteData.length < 6 ? pasteData.length : 5  ;
    inputRefs.current[next].focus();
    
  }
  const handleVerify = async (e) => {
    const otp = inputRefs.current.map(input => input.value).join('');
    
    if (otp.length !==  6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    setOtp(otp);
    setIsOtpVerified(true);
    
  }

  const onSubmitEmail = async(e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/send-reset-otp?email=${email}`);
      if (response.status === 200) {
        toast.success("Reset password link sent to your email!");
        setIsEmailSent(true);
      } else {
        toast.error("Failed to send reset password link.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred while sending reset password email.");
    } finally {
      setLoading(false);
    }

  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/reset-password`, { email, newPassword, otp });
      if (response.status === 200) {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error("Failed to reset password.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred while resetting password.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div
      className="email-verify-container d-flex align-items-center justify-content-center vh-100 position-relative"
      style={{
        background:
          "linear-gradient(90deg,rgb(79, 68, 174),rgb(126, 104, 224))",
        border: "none",
      }}
    >
      <Link
        to="/"
        className="position-absolute top-0 start-0 p-4 d-flex align-items-center text-decoration-none"
      >
        <img src={assets.logo1} alt="logo" height={32} width={32} />
        <span className="fs-4 fw-semibold text-light">Authify</span>
      </Link>

      {/* { Reset password card } */}
      {!isEmailSent && (
        <div
          className="rounded-4 p-5 text-center bg-white shadow-sm"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <h4 className="mb-2">Reset Password</h4>
          <p className="mb-4">
            Enter your registered email to receive a reset password link.
          </p>

          <form onSubmit={onSubmitEmail}>
            <div className="input-group mb-4 bg-secondary bg-opacity-10 rounded-pill">
              <span className="input-group-text bg-transparent border-0 ps-4">
                <i className="bi bi-envelope"></i>
              </span>

              <input
                type="email"
                className="form-control bg-transparent border-0  ps-1 pe-4 rounded-end"
                placeholder="Enter your email"
                style={{ height: "50px" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              className="btn btn-primary w-100 py-2"
              type="submit"
              disabled={loading}
            >
             {loading ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>

      )}
      {/* {OTP Card }*/}
        {!isOtpVerified && isEmailSent &&(
          <div className="p-5 rounded-4 shadow bg-white" style={{width: "400px"}}>
        <h2 className="text-center  fw-bold mb-2">Email Verify OTP</h2>
        <p className="text-center mb-4">
         Please check your inbox and Enter the 6-digit code sent to your mail.
        </p>

        <div className="d-flex justify-content-between gap-2 mb-4 text-center text-white-50 text-center mb-2">
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength="1"
              className="form-control text-center fs-4 otp-input"
              style={{ width: "44px", height: "44px", border: "1.5px solid #343a40" }}
              ref={(el) => (inputRefs.current[i] = el)}
              onChange = {(e) => handleOtpChange(e, i)}
              onKeyDown = {(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
            />
          ))}
        </div>
        
        <button className="btn btn-primary w-100 fw-semibold " disabled={loading} onClick={handleVerify} >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </div>
      )}
      {/* New Password Form */}
          {isOtpVerified && isEmailSent && (
            <div className="rounded-4 p-4 text-center bg-white" style={{ width: "100%", maxWidth: "400px" }}>
              <h4>New Password</h4>
              <p className="mb-4">Enter the new password below</p>
              <form>
                <div className="input-group mb-4 bg-secondary bg-opacity-10 rounded-pill">
                  <span className="input-group-text bg-transparent border-0 ps-4">
                    <i className="bi bi-person-fill-lock"></i>
                  </span>

                  <input
                    type="password"
                    className="form-control bg-transparent border-0 ps-1 pe-4 rounded-end"
                    placeholder="Enter new password"
                    style={{ height: "50px" }}
                    value={newPassword}
                    onChange={(e) => setnewPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading} onClick={onSubmitNewPassword}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

            </div>
          )}
    </div>
    
  );
};

export default ResetPassword;
