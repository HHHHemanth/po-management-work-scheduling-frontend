import { useState, useEffect } from "react";
import { getAllWorks } from "../services/workService";
import { getAllAssociates } from "../services/associateService";
import { getRecords } from "../services/recordService";

function AdminDashboard() {

  // ✅ Declare all state FIRST
  const [records, setRecords] = useState([]);
  const [works, setWorks] = useState([]);
  const [associates, setAssociates] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const recordsData = await getRecords();
      setRecords(recordsData || []);

      const worksData = await getAllWorks();
      setWorks(worksData || []);

      const associatesData = await getAllAssociates();
      setAssociates(associatesData || []);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // ================= Budget Calculations =================

  const totalRecords = records.length;

  const totalApproval = records.reduce(
    (sum, r) => sum + (r.approval_rs || 0),
    0
  );

  const totalUtilization = records.reduce(
    (sum, r) => sum + (r.utilization_rs || 0),
    0
  );

  const remainingBudget = totalApproval - totalUtilization;

  const budgetSummary = {};

  records.forEach((r) => {
    const head = r.project_head || "Unknown";

    if (!budgetSummary[head]) {
      budgetSummary[head] = {
        approved: 0,
        utilized: 0
      };
    }

    budgetSummary[head].approved += r.approval_rs || 0;
    budgetSummary[head].utilized += r.utilization_rs || 0;
  });

  // ================= Other Stats =================

  const uniqueStaff = new Set(records.map(r => r.staff_id)).size;
  const totalWorks = works.length;

  const pending = works.filter(
    w => !w.progress_description
  ).length;

  const completed = works.filter(
    w => w.progress_description?.toLowerCase().includes("complete")
  ).length;

  const delayed = works.filter(
    w => w.reason_for_delay && w.reason_for_delay !== ""
  ).length;

  const inProgress = totalWorks - (pending + completed + delayed);

  // ================= UI =================

  return (
    <div className="space-y-10">

      <h2 className="text-3xl font-bold text-gray-800">
        Dashboard
      </h2>

      {/* ================= Budget Overview ================= */}

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Budget Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <Card title="Total Approval" value={totalApproval} color="blue" icon="📈" />
          <Card title="Total Utilization" value={totalUtilization} color="green" icon="⏱" />
          <Card title="Remaining Budget" value={remainingBudget} color="yellow" icon="💰" />

          <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Records</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {totalRecords}
              </p>
            </div>
            <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
              📄
            </div>
          </div>

        </div>
      </div>

      {/* ================= Budget Head Summary ================= */}

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Budget Head Summary
        </h3>

        {Object.keys(budgetSummary).length === 0 ? (
          <p className="text-gray-500">No budget data available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {Object.entries(budgetSummary)
              .sort(([a], [b]) => a.localeCompare(b)) // ✅ sorting
              .map(([head, data]) => {

                const remaining = data.approved - data.utilized;

                return (
                  <div key={head} className="bg-white p-6 rounded-xl shadow">

                    <p className="text-gray-500 text-sm mb-2 font-semibold">
                      {head}
                    </p>

                    <p className="text-blue-600 font-bold">
                      Approved: ₹ {data.approved.toLocaleString("en-IN")}
                    </p>

                    <p className="text-red-600 font-bold">
                      Utilized: ₹ {data.utilized.toLocaleString("en-IN")}
                    </p>

                    <p className="text-green-600 font-bold">
                      Remaining: ₹ {remaining.toLocaleString("en-IN")}
                    </p>

                  </div>
                );
              })}

          </div>
        )}
      </div>

      {/* ================= Work Overview ================= */}

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Work Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          <Card title="Total Works" value={totalWorks} color="blue" icon="📦" />
          <Card title="Pending" value={pending} color="gray" icon="🕒" />
          <Card title="In Progress" value={inProgress} color="yellow" icon="📊" />
          <Card title="Completed" value={completed} color="green" icon="✅" />
          <Card title="Delayed" value={delayed} color="red" icon="⚠️" />

        </div>
      </div>

      {/* ================= User Overview ================= */}

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          User Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <Card title="Total Users" value={uniqueStaff} color="blue" icon="👥" />
          <Card title="Admins" value={1} color="purple" icon="👑" />
          <Card title="Staff Members" value={uniqueStaff} color="green" icon="🧑‍💼" />

          <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Project Associates</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">
                {associates.length}
              </p>
            </div>
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
              🛠
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

// ✅ Reusable Card Component
function Card({ title, value, color, icon }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    yellow: "text-yellow-600 bg-yellow-100",
    red: "text-red-600 bg-red-100",
    gray: "text-gray-600 bg-gray-100",
    purple: "text-purple-600 bg-purple-100"
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className={`text-2xl font-bold mt-2 ${colorMap[color].split(" ")[0]}`}>
          {typeof value === "number"
            ? value.toLocaleString("en-IN")
            : value}
        </p>
      </div>
      <div className={`${colorMap[color]} p-3 rounded-lg`}>
        {icon}
      </div>
    </div>
  );
}

export default AdminDashboard;