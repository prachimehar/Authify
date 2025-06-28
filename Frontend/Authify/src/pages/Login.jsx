import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Loading,setLoading] = useState(false);
  const {BASE_URL,setIsLoggedIn,getUserData} = useContext(AppContext);
  const navigate = useNavigate();

  const onSumbitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    setLoading(true);
    try {
      
      if (isCreateAccount ) {
        const response = await axios.post(`${BASE_URL}/register`,{name,email,password});
        if(response.status === 201) {
          toast.success("Account created successfully!");
          navigate("/");
        }else{
          toast.error("Email already exists, please login.");
        }
      }
      else{
        const response = await axios.post(`${BASE_URL}/login`, {email,password});
        if (response.status === 200) {
          setIsLoggedIn(true);
          getUserData();
          toast.success("Login successful!");
          navigate("/");
        } else {
          console.log(error.response.data);
          toast.error("Invalid email or password.");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally{
      setLoading(false);
    }
  }

  return (
    <div
      className="position-relative d-flex flex-column align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(90deg,rgb(85, 74, 181),rgb(110, 88, 212))",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "30px",
          display: "flex",
          alignItems: "center",
          zIndex: 1, 
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "24px",
            textDecoration: "none",
            color: "white", 
          }}
        >
          <img src={assets.logo1} alt="logo" height={42} width={42} />
          <span className="fw-bold fs-4 text-light">Authify</span>
        </Link>
      </div>
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">
          {isCreateAccount ? "Create Account" : "Login"}
          </h2>
        <form onSubmit={onSumbitHandler}>
          {
            isCreateAccount && (
              <div className="mb-3">
                <label htmlFor="FullName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="FullName"
                  placeholder="Enter your name"
                  required
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
            )
          }
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className="mt-3 mb-3 d-flex justify-content-between">
            <Link to="/reset-password" className="text-decoration-none text-dark">
              Forgot Password?
            </Link>
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={Loading}>
            {Loading ? "Loading..." : isCreateAccount ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-muted">
            {isCreateAccount ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              className="text-primary " style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => setIsCreateAccount(!isCreateAccount)} 
            >
              {isCreateAccount ? "Login" : "Create Account"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
