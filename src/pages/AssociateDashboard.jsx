import { useEffect, useState } from "react";
import { getAssociateWorks } from "../services/workService";


function AssociateDashboard() {
  const [works, setWorks] = useState([]);
  const name = localStorage.getItem("staff_id");

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
  try {
    const data = await getAssociateWorks();
    setWorks(data || []);
  } catch (err) {
    console.error(err);
  }
};

  const totalWorks = works.length;

  const pending = works.filter(
    (w) => !w.tracker || w.tracker === "Pending"
  ).length;

  const inProgress = works.filter(
    (w) =>
      (typeof w.tracker === "object"
        ? w.tracker?.status
        : w.tracker) === "In Progress"
  ).length;

  const completed = works.filter(
    (w) =>
      (typeof w.tracker === "object"
        ? w.tracker?.status
        : w.tracker) === "Completed"
  ).length;

  const delayed = works.filter(
    (w) =>
      (typeof w.tracker === "object"
        ? w.tracker?.status
        : w.tracker) === "Delayed"
  ).length;

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2">
          Welcome {name}
        </h2>
        <p className="text-gray-600">
          Manage your assigned tasks and update progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Total Works" value={totalWorks} color="text-blue-600" />
        <Card title="Pending" value={pending} color="text-gray-600" />
        <Card title="In Progress" value={inProgress} color="text-yellow-600" />
        <Card title="Completed" value={completed} color="text-green-600" />
        <Card title="Delayed" value={delayed} color="text-red-600" />
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className={`text-2xl font-bold mt-2 ${color}`}>
        {value}
      </p>
    </div>
  );
}

export default AssociateDashboard;