import { useState } from "react";

function Navbar() {
  const [logoutModal, setLogoutModal] = useState(false);

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
    PO Management System
  </h3>
</div>

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
    transition: "all 0.3s ease"
  }}
  onMouseOver={(e) => {
    e.target.style.backgroundColor = "#f87171";
    e.target.style.color = "white";
  }}
  onMouseOut={(e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "#f87171";
  }}
>
  Logout
</button>

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