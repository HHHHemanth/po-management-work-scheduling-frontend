import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import Cubes from '../components/Cubes'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

function LoginPage() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);



  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    let endpoint = "";
    let payload = {};

    if (role === "admin") {
      endpoint = "/login/admin";
      payload = { password };
    }

    if (role === "staff") {
      endpoint = "/login/staff";
      payload = { staff_id: staffId, password };
    }

    if (role === "project-associate") {
      endpoint = "/login/project-associate";
      payload = { staff_id: staffId, password };
    }

    const response = await API.post(endpoint, payload);

    const token =
      typeof response.data === "string"
        ? response.data
        : response.data.token;

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    if (role === "admin") {
      localStorage.setItem("staff_id", "admin");
    } else {
        localStorage.setItem("staff_id", staffId);
    }  

    if (response.data.name) {
      localStorage.setItem("name", response.data.name);
    }

    if (role === "admin") navigate("/admin");
    if (role === "staff") navigate("/staff");
    if (role === "project-associate") navigate("/associate");

  } catch (error) {
    console.log(error.response?.data);
    alert("Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background Image */}
    <div
    className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cover bg-center z-0"
    style={{ backgroundImage: "url('/background.jpg')" }}
    >


      {/* Floating Glow Effects */}
<Link to="/">
  <img
    src="/cmtilogo.png"
    alt="CMTI Logo"
    className="absolute top-6 left-6 h-14 md:h-16 z-40 object-contain cursor-pointer z-10"
  />
</Link>

{/* Top Right Logo */}
<img
  src="/mhilogo.png"
  alt="MHI Logo"
  className="absolute top-6 right-6 h-14 md:h-16 z-40 object-contain"
/>
<div className="absolute inset-0 z-10 flex items-center justify-center">
  <Cubes 
    gridSize={10}
    maxAngle={45}
    radius={5}
    borderStyle="2px solid rgba(255,255,255,0.4)"
    faceColor="transparent"
    rippleColor="rgba(255,255,255,0.6)"
    rippleSpeed={1.5}
    autoAnimate
    rippleOnClick
  />
    <div
    className="absolute inset-0 bg-cover bg-center z-10 pointer-events-none"
    style={{ backgroundImage: "url('/background2.png')" }}
  />
</div>
      <div className="

  relative
  bg-white/5
  backdrop-blur-xl
  border border-white/5
  rounded-2xl
  shadow-2xl
  p-12
  text-center
  max-w-xl
  w-full
  z-40
">

            <h2 className="text-3xl font-bold text-center text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]  mb-6">
              {role === "admin" ? "ADMIN LOGIN" : "STAFF LOGIN"}
            </h2>
            {successMessage && (
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-center mb-4">
                {successMessage}
              </div>
            )}


            <form onSubmit={handleLogin} className="space-y-5">

              {role !== "admin" && (
                <div>



                  <TextField
                    fullWidth
                    label="Staff ID"
                    variant="outlined"
                    autoComplete="current-password"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    sx={{
                      /* Label color */
                      "& .MuiInputLabel-root": {
                        color: "#ffffff",
                        fontWeight: 500,
                      },

                      /* Label color when focused */
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#ffffff", // blue-500
                      },

                      /* Input text */
                      "& .MuiOutlinedInput-input": {
                        color: "#ffffff",
                      },

                      /* Input background + shape */
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "12px",

                        /* Default border */
                        "& fieldset": {
                          borderColor: "#ffffff",
                        },

                        /* Hover border */
                        "&:hover fieldset": {
                          borderColor: "#ffffff",
                        },

                        /* Focus border */
                        "&.Mui-focused fieldset": {
                          borderColor: "#ffffff",
                          borderWidth: "2px",
                        },
                      },
                    }}
                  />
                </div>
              )}

              <div>


                <div className="relative">

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                      /* Label color */
                      "& .MuiInputLabel-root": {
                        color: "#ffffff",
                        fontWeight: 500,
                      },

                      /* Label color when focused */
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#ffffff", // blue-500
                      },

                      /* Input text */
                      "& .MuiOutlinedInput-input": {
                        color: "#ffffff",
                      },

                      /* Input background + shape */
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "12px",

                        /* Default border */
                        "& fieldset": {
                          borderColor: "#ffffff",
                        },

                        /* Hover border */
                        "&:hover fieldset": {
                          borderColor: "#ffffff",
                        },

                        /* Focus border */
                        "&.Mui-focused fieldset": {
                          borderColor: "#ffffff",
                          borderWidth: "2px",
                        },
                      },
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-blue-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition duration-300 cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>


            </form>

          </div>
        </div>

      </div>

  );
}

export default LoginPage;
