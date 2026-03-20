import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Navbar() {
  const [logoutModal, setLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <div
        style={{
          height: "60px",
          backgroundColor: "#0f172a",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <div
    style={{
      width: "4px",
      height: "22px",
      background: "linear-gradient(#3b82f6, #2563eb)",
      borderRadius: "4px",
    }}
  />
  <h3
    style={{
      fontSize: "19px",
      fontWeight: "600",
      color: "white",
      letterSpacing: "0.6px",
    }}
  >
    Tech Walnut Project Management System
  </h3>
</div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

  {/* Profile Button */}
 <button
  onClick={() => navigate("profile")}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "white",
    border: "none",
    borderRadius: "999px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
    transition: "all 0.3s ease",
  }}
  onMouseOver={(e) => {
    e.target.style.transform = "scale(1.05)";
    e.target.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.6)";
  }}
  onMouseOut={(e) => {
    e.target.style.transform = "scale(1)";
    e.target.style.boxShadow = "0 2px 8px rgba(37, 99, 235, 0.4)";
  }}
>
  👤 Profile
</button>

  {/* Logout Button */}
  <button
    onClick={() => setLogoutModal(true)}
    style={{
      padding: "8px 18px",
      backgroundColor: "transparent",
      color: "#f87171",
      border: "1px solid #f87171",
      borderRadius: "999px",
      fontWeight: "500",
      cursor: "pointer",
    }}
  >
    Logout
  </button>

</div>

      </div>

      {logoutModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              width: "400px",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginBottom: "10px" }}>Confirm Logout</h2>

            <p style={{ marginBottom: "20px" }}>
              Are you sure you want to logout?
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>

              <button
                onClick={() => setLogoutModal(false)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#e5e7eb",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;