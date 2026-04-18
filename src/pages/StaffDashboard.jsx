import { useState, useEffect } from "react";
import { getRecords } from "../services/recordService";
import { getStaffWorks } from "../services/workService";

function StaffDashboard() {
  const [records, setRecords] = useState([]);
  const [works, setWorks] = useState([]);

  const staffId = localStorage.getItem("staff_id");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Records
      const recordsData = await getRecords();

      const myRecords = recordsData.filter(
        (r) => String(r.staff_id) === String(staffId)
      );

      setRecords(myRecords);

      // Works
      const worksData = await getStaffWorks();
      setWorks(worksData || []);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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

  const totalWorks = works.length;

  const pending = works.filter((w) => {
    const tracker =
      typeof w.tracker === "object"
        ? w.tracker?.status
        : w.tracker;

    return !tracker || tracker === "Pending";
  }).length;

  const inProgress = works.filter((w) => {
    const tracker =
      typeof w.tracker === "object"
        ? w.tracker?.status
        : w.tracker;

    return tracker === "In Progress";
  }).length;

  const completed = works.filter((w) => {
    const tracker =
      typeof w.tracker === "object"
        ? w.tracker?.status
        : w.tracker;

    return tracker === "Completed";
  }).length;

  const delayed = works.filter((w) => {
    const tracker =
      typeof w.tracker === "object"
        ? w.tracker?.status
        : w.tracker;

    return tracker === "Delayed";
  }).length;

  return (
    <div className="space-y-8">

      <h2 className="text-3xl font-bold text-gray-800">
        Staff Dashboard
      </h2>

      {/* Record Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">
            Your Records
          </h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {totalRecords}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">
            Total Approval ₹
          </h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            ₹ {totalApproval}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">
            Total Utilization ₹
          </h3>
          <p className="text-2xl font-bold text-red-600 mt-2">
            ₹ {totalUtilization}
          </p>
        </div>

      </div>

      {/* Work Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">
            Total Works
          </h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {totalWorks}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">
            Pending
          </h3>
          <p className="text-2xl font-bold text-gray-600 mt-2">
            {pending}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">
            In Progress
          </h3>
          <p className="text-2xl font-bold text-yellow-600 mt-2">
            {inProgress}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">
            Completed
          </h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {completed}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">
            Delayed
          </h3>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {delayed}
          </p>
        </div>

      </div>

    </div>
  );
}

export default StaffDashboard;