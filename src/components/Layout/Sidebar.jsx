import { NavLink, useLocation } from "react-router-dom";

function Sidebar() {
  const role = localStorage.getItem("role");
  const location = useLocation();

  return (
    <div
      style={{
        width: "240px",
        background: "linear-gradient(180deg, #0f172a, #0b1220)",
        height: "calc(100vh - 60px)",
        padding: "30px 18px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 15px rgba(0,0,0,0.3)",
      }}
    >
      {role === "admin" && (
        <>
          <SidebarLink to="/admin" label="Dashboard" end />
          <SidebarLink to="/admin/users" label="Staffs" />
          <SidebarLink to="/admin/records" label="Staff Records" />
          <SidebarLink to="/admin/associates" label="Project Associates" />
          <SidebarLink to="/admin/works" label="Project Associate Works" />
          <SidebarLink to="/admin/work-documents" label="Work Documents" />
      
        </>
      )}

      {role === "staff" && (
        <>
          <SidebarLink to="/staff" label="Dashboard" end />
          <SidebarLink to="/staff/records" label="My Records" />
          <SidebarLink to="/staff/associates" label="My Project Associates" />
          <SidebarLink to="/staff/works" label="Project Associate Works" />
          <SidebarLink to="/staff/work-documents" label="Work Documents" />
          
        </>
      )}

      {role === "project-associate" && (
        <>
          <SidebarLink to="/associate" label="Dashboard" end />
          <SidebarLink to="/associate/works" label="My Works" />
          <SidebarLink to="/associate/work-documents" label="My Work Documents" />
        </>
      )}
    </div>
  );
}

function SidebarLink({ to, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        padding: "12px 16px",
        marginBottom: "12px",
        borderRadius: "8px",
        textDecoration: "none",
        fontSize: "15px",
        fontWeight: "500",
        display: "block",
        transition: "all 0.2s ease",
        color: isActive ? "#ffffff" : "#cbd5e1",
        backgroundColor: isActive ? "#2563eb" : "transparent",
      })}
    >
      {label}
    </NavLink>
  );
}

export default Sidebar;