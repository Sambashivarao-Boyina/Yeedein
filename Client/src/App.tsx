import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout, setCredentials } from "./store/slices/authSlice";
import SignUp from "./pages/SignUp";
import CheckInStudent from "./pages/CheckInStudent";
import ScanFood from "./pages/ScanFood";
import ScanIceCream from "./pages/ScanIceCream";
import StudentSearch from "./pages/StudentSearch";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const token = localStorage.getItem("token")
        console.log(token);
        const response = await axios.post(
          "api/auth/refreshToken",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        console.log(data);
        dispatch(setCredentials({ user: data.user, token: data.token }));
      } catch (error) {
        console.log("Error:", error);
        dispatch(logout());
        localStorage.removeItem("token"); 
      }
    };

    refreshToken();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/checkin"
            element={<PrivateRoute element={<CheckInStudent />} />}
          />
          <Route
            path="/scanfood"
            element={<PrivateRoute element={<ScanFood />} />}
          />
          <Route
            path="/scanicecream"
            element={<PrivateRoute element={<ScanIceCream />} />}
          />
          <Route
            path="/searchstudent"
            element={<PrivateRoute element={<StudentSearch />} />}
          />
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
        </Routes>
        <Toaster position="top-center" />
      </div>
    </Router>
  );
}

export default App;
