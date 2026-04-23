import { Outlet } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";

function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        {/* ✅ FINAL FIX */}
        <div className="p-6 bg-gray-100 flex-1 overflow-y-auto min-h-0">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default AdminLayout;