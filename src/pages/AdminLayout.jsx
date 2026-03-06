import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";  


  

  function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        {/* THIS CONTROLS PAGE SCROLL */}
        <div className="p-6 bg-gray-100 flex-1 overflow-hidden flex flex-col">
          <Outlet />
        </div>

      </div>

    </div>
  );
}

export default AdminLayout;