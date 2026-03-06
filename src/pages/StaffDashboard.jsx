import { useState, useEffect } from "react";
import { getRecords } from "../services/recordService";

function StaffDashboard() {
  const [records, setRecords] = useState([]);

  const staffId = localStorage.getItem("staff_id");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getRecords();

      const myRecords = data.filter(
        r => String(r.staff_id) === String(staffId)
      );

      setRecords(myRecords);
    } catch (error) {
      console.error("Error fetching staff data:", error);
    }
  };

  const totalRecords = records.length;

  const totalApproval = records.reduce(
    (sum, r) => sum + (r.approval_rs || 0),
    0
  );

  const totalUtilization = records.reduce(
    (sum, r) => sum + (r.utilization_rs || 0),
    0
  );

  return (
    <div className="space-y-6">

      <h2 className="text-3xl font-bold text-gray-800">
        Staff Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Your Records</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {totalRecords}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Total Approval ₹</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            ₹ {totalApproval}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Total Utilization ₹</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">
            ₹ {totalUtilization}
          </p>
        </div>

      </div>

    </div>
  );
}

export default StaffDashboard;
