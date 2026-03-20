import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function AssociateWorks() {
  const [works, setWorks] = useState([]);

  const fetchWorks = async () => {
    try {
      const res = await API.get("/associate/my-works");
      setWorks(res.data);
    } catch (err) {
      toast.error("Failed to load works");
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Works</h2>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">Project</th>
              <th className="px-6 py-3">Task</th>
              <th className="px-6 py-3">Deadline</th>
              <th className="px-6 py-3">Due Time</th>
              <th className="px-6 py-3">Progress</th>
              <th className="px-6 py-3">Suggestions</th>
            </tr>
          </thead>

          <tbody>
            {works.map((work) => (
              <tr key={work.work_id} className="border-t">
                <td className="px-6 py-4">{work.project_name}</td>
                <td className="px-6 py-4">{work.task}</td>
                <td className="px-6 py-4">
                  {new Date(work.deadline_time).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <td>{`${work.due_time_days ?? 0} days`}</td>

                  {work.progress_description || "Not updated"}
                </td>

                <td className="px-6 py-4">
  {work.suggestions && work.suggestions.length > 0 ? (
    work.suggestions.map((s, i) => (
      <div key={i} className="text-sm text-gray-700">
        • {s}
      </div>
    ))
  ) : (
    <span className="text-gray-400 text-sm">No suggestions</span>
  )}
</td>
              </tr>
              
              
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssociateWorks;