
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import EmailVerify from './pages/EmailVerify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContextProvider } from './context/AppContext'; 
import './App.css';

function App() {
  return (
    <AppContextProvider> {/* ✅ Wrap entire app here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-verify" element={<EmailVerify />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </AppContextProvider>
  );
}

export default App;



