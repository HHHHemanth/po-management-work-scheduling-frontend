import { useState, useEffect } from "react";
import { getAllWorks } from "../services/workService";
import { getAllAssociates } from "../services/associateService";
import { getRecords } from "../services/recordService";

function AdminDashboard() {
  
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    const recordsData = await getRecords();
    setRecords(recordsData);

    const worksData = await getAllWorks();
    setWorks(worksData);

    const associatesData = await getAllAssociates();
    setAssociates(associatesData);

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

  const uniqueStaff = new Set(records.map(r => r.staff_id)).size;
  const [works, setWorks] = useState([]);
  const [associates, setAssociates] = useState([]);
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

const inProgress = works.length - (pending + completed + delayed);

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

          <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Approval</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                ₹ {totalApproval}
              </p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              📈
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Utilization</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ₹ {totalUtilization}
              </p>
            </div>
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              ⏱
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Remaining Budget</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">
                ₹ {remainingBudget}
              </p>
            </div>
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
              💰
            </div>
          </div>

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

  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

    {Object.entries(budgetSummary).map(([head, data]) => {
      const remaining = data.approved - data.utilized;

      return (
        <div key={head} className="bg-white p-6 rounded-xl shadow">

          <p className="text-gray-500 text-sm mb-1">{head}</p>

          <p className="text-blue-600 font-bold">
            Approved: ₹ {data.approved}
          </p>

          <p className="text-red-600 font-bold">
            Utilized: ₹ {data.utilized}
          </p>

          <p className="text-green-600 font-bold">
            Remaining: ₹ {remaining}
          </p>

        </div>
      );
    })}

  </div>
</div>
      {/* ================= Work Overview ================= */}

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Work Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Works</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{totalWorks}</p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              📦
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold text-gray-600 mt-2">{pending}</p>
            </div>
            <div className="bg-gray-100 text-gray-600 p-3 rounded-lg">
              🕒
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">{inProgress}</p>
            </div>
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
              📊
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{completed}</p>
            </div>
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              ✅
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Delayed</p>
              <p className="text-2xl font-bold text-red-600 mt-2">{delayed}</p>
            </div>
            <div className="bg-red-100 text-red-600 p-3 rounded-lg">
              ⚠️
            </div>
          </div>

        </div>
      </div>

      {/* ================= User Overview ================= */}

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          User Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {uniqueStaff}
              </p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              👥
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Admins</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                1
              </p>
            </div>
            <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
              👑
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Staff Members</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {uniqueStaff}
              </p>
            </div>
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              🧑‍💼
            </div>
          </div>

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

export default AdminDashboard;