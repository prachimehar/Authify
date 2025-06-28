// src/pages/EmailVerify.jsx
import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmailVerify = () => {
  const  inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const { getUserData, isLoggedIn, userData, BASE_URL } = useContext(AppContext);
  const navigate = useNavigate();

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
    setLoading(true);
    try {
      const response = await axios.post(BASE_URL+"/verify-otp", { otp });
      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        getUserData();
        navigate("/");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {

    isLoggedIn && userData && userData.isAccountVerified && navigate("/");

  }, [isLoggedIn, userData]);

  return (
    <div className="email-verify-page d-flex align-items-center justify-content-center vh-100 position-relative" 
      style={{background: "linear-gradient(90deg,rgb(79, 68, 174),rgb(126, 104, 224))",borderRadius:"none"}}>
      <Link to="/" className="position-absolute top-0 start-0 p-4 d-flex align-items-center text-decoration-none">
      <img src={assets.logo1} alt="logo" height={32} width={32}/>
      <span className="fs-4 fw-semibold text-light">Authify</span>
      </Link>

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
        <button className="btn btn-primary w-100 fw-semibold" disabled={loading} onClick={handleVerify} >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </div>
    </div>
  );
};

export default EmailVerify;
