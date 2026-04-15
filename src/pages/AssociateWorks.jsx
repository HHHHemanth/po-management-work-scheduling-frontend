import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function AssociateWorks() {
  const [works, setWorks] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [extensionModal, setExtensionModal] = useState(null);
  const [extensionDays, setExtensionDays] = useState("");

  const fetchWorks = async () => {
    try {
      const res = await API.get("/associate/my-works");
      setWorks(res.data);
    } catch (err) {
      toast.error("Failed to load works");
    }
  };

  

  const updateTracker = async (work, status) => {
  try {
    setLoadingId(work.work_id);

    if (status === "Completed") {
      await API.put(`/works/${work.work_id}/complete`);

      await API.put(`/works/${work.work_id}/progress`, {
        progress_description: "Completed"
      });

      // clear old delay
      await API.put(`/works/${work.work_id}/delay`, {
        reason: null
      });
    }

    else if (status === "Pending") {
      await API.put(`/works/${work.work_id}/progress-value`, {
        progress: 0
      });

      await API.put(`/works/${work.work_id}/progress`, {
        progress_description: "Pending"
      });

      // clear old delay
      await API.put(`/works/${work.work_id}/delay`, {
        reason: null
      });
    }

    else if (status === "In Progress") {
      await API.put(`/works/${work.work_id}/progress-value`, {
        progress: 50
      });

      await API.put(`/works/${work.work_id}/progress`, {
        progress_description: "Work in progress"
      });

      // clear old delay
      await API.put(`/works/${work.work_id}/delay`, {
        reason: null
      });
    }

    else if (status === "Delayed") {
  await API.put(`/works/${work.work_id}/delay`, {
    reason: "Work delayed"
  });
}

else if (status === "Extension Requested") {
  if (work.extension_requested) {
    toast.error("Already requested");
    return;
  }

  setExtensionModal(work);
  setLoadingId(null);
  return;
}

await fetchWorks();
toast.success("Status updated");

  } catch (err) {
    toast.error("Failed to update tracker");
  } finally {
    setLoadingId(null);
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
              <th className="px-6 py-3">Tracker</th>
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
  {`${work.due_time_days ?? 0} days`}
</td>

<td className="px-6 py-4">
  {work.progress_description || "Not updated"}
</td>
                <td className="px-6 py-4">
  <select
  className="border px-2 py-1 rounded"
  disabled={loadingId === work.work_id}
  value={
  work.progress_description === "Completed"
    ? "Completed"
    : work.progress_description === "Work in progress"
    ? "In Progress"
    : work.progress_description === "Pending"
    ? "Pending"
    : work.reason_for_delay
    ? "Delayed"
    : work.extension_requested
    ? "Extension Requested"
    : "Pending"
}
  onChange={(e) => updateTracker(work, e.target.value)}
>
  <option>Pending</option>
  <option>In Progress</option>
  <option>Completed</option>
  <option>Delayed</option>
  <option>Extension Requested</option>
</select>
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
        {extensionModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[420px] shadow-xl space-y-4">

      <h3 className="text-xl font-semibold text-center">
        Request Extension
      </h3>

      <input
        type="number"
        placeholder="Enter number of days"
        value={extensionDays}
        onChange={(e) => setExtensionDays(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={async () => {
            try {
              if (!extensionDays) {
                toast.error("Enter days");
                return;
              }

              await API.post(
                `/works/${extensionModal.work_id}/request-extension?reason=Request ${extensionDays} days extension`
              );

              toast.success("Extension requested");

              setExtensionModal(null);
              setExtensionDays("");

              await fetchWorks();

            } catch (err) {
              toast.error("Request failed");
            }
          }}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Submit
        </button>

        <button
          onClick={() => {
            setExtensionModal(null);
            setExtensionDays("");
          }}
          className="px-5 py-2 bg-gray-300 rounded-lg"
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default AssociateWorks;