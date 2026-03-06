import { useState, useEffect } from "react";
import { getRecords } from "../services/recordService";

function AdminDashboard() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getRecords();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const totalRecords = records.length;

  const pendingApprovals = records.filter(
    (record) => record.status === "Pending"
  ).length;

  const uniqueStaff = new Set(records.map(r => r.staff_id)).size;

  return (
    <div className="space-y-6">

      <h2 className="text-3xl font-bold text-gray-800">
        Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Total Records</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {totalRecords}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Total Staff</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {uniqueStaff}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Pending Approvals</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {pendingApprovals}
          </p>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
