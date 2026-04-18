import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function AssociateWorks() {
  const [works, setWorks] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [extensionModal, setExtensionModal] = useState(null);
  const [extensionDays, setExtensionDays] = useState("");
  const [progressModal, setProgressModal] = useState(null);
const [delayModal, setDelayModal] = useState(null);
const [inputValue, setInputValue] = useState("");

 const fetchWorks = async () => {
  try {
    const res = await API.get("/works");
    setWorks(res.data || []);
  } catch (err) {
    console.error(err.response?.data || err.message);
    toast.error("Failed to load works");
  }
};
  

  const updateTracker = async (work, status) => {
  try {
    setLoadingId(work.work_id);

    // Extension still opens modal
    if (status === "Extension Requested") {
      if (work.extension_requested) {
        toast.error("Already requested");
        return;
      }

      setExtensionModal(work);
      setLoadingId(null);
      return;
    }

    // Save tracker directly
    await API.put(`/works/${work.work_id}/tracker`, {
      tracker: status
    });

    await fetchWorks();
    toast.success("Status updated");

  } catch (err) {
    console.error(err);
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

      <div className="bg-white shadow rounded-xl">

  <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
    <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            
  <tr>
    <th className="px-6 py-3">Associate ID</th>
    <th className="px-6 py-3">Project</th>
    <th className="px-6 py-3">Task</th>
    <th className="px-6 py-3">Assigned On</th>
    <th className="px-6 py-3">Deadline</th>
    <th className="px-6 py-3">Due Time</th>
    <th className="px-6 py-3">Progress</th>
    <th className="px-6 py-3">Delay Reason</th>
    <th className="px-6 py-3">Tracker</th>
    <th className="px-6 py-3">Extension</th>
    <th className="px-6 py-3">Suggestions</th>
    <th className="px-6 py-3">Actions</th>
  </tr>
</thead>
        

          <tbody>
            {works.map((work) => (
              <tr key={work.work_id} className="border-t">

  <td className="px-6 py-4 text-blue-600 font-medium">
    {work.staff_id}
  </td>

  <td className="px-6 py-4">{work.project_name}</td>

  <td className="px-6 py-4">{work.task}</td>

  <td className="px-6 py-4">
  {new Date(work.assigned_on || work.created_at).toLocaleDateString("en-GB")}
</td>

  <td className="px-6 py-4">
  {work.deadline_time
    ? new Date(work.deadline_time).toLocaleDateString("en-GB")
    : "-"}
</td>

  <td className="px-6 py-4">
    {`${work.due_time_days ?? 0} days`}
  </td>

  <td className="px-6 py-4">
    {work.progress_description || "Not updated"}
  </td>

  {work.reason_for_delay ? (
  <span className="text-red-600">{work.reason_for_delay}</span>
) : "-"}

  <td className="px-6 py-4">
    <select
      className="border px-2 py-1 rounded"
      disabled={loadingId === work.work_id}
      value={
        typeof work.tracker === "object"
          ? work.tracker?.status || "Pending"
          : work.tracker || "Pending"
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
    {work.extension_requested ? (
      <div className="text-blue-600 text-sm">
        Extension Requested
        <div className="text-gray-500 text-xs">
          {work.extension_reason}
        </div>
      </div>
    ) : "-"}
  </td>

  <td className="px-6 py-4">
    {work.suggestion ? (
  <span className="text-blue-600">{work.suggestion}</span>
) : (
  <span className="text-gray-400 text-sm">No suggestions</span>
)
    }
  </td>

  <td className="px-6 py-4 space-x-2">
    <button
  onClick={() => {
    setProgressModal(work.work_id);
    setInputValue("");
  }}
  className="text-green-600"
>
  Progress
</button>

<button
  onClick={() => {
    setDelayModal(work);
    setInputValue("");
  }}
  className="text-red-600"
>
  Delay
</button>
    
  </td>

</tr>
              
              
            ))}
          </tbody>
        </table>
        </div>
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
  `/works/${extensionModal.work_id}/request-extension`,
  null,
  {
    params: {
      reason: `Request ${extensionDays} days extension`
    }
  }
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
{progressModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[420px] space-y-4">

      <h3 className="text-xl font-semibold text-center">
        Update Progress
      </h3>

      <input
        type="text"
        placeholder="Enter progress"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <div className="flex justify-center gap-4">
        <button
          
          onClick={async () => {
  try {
    if (!inputValue.trim()) {
      toast.error("Enter progress");
      return;
    }

    await API.put(`/works/${progressModal}/tracker`, {
      tracker: "In Progress"
    });

    await API.put(`/works/${progressModal}/progress`, {
      progress_description: inputValue
    });

    toast.success("Progress updated");
    setProgressModal(null);
    setInputValue("");
    fetchWorks();

  } catch (err) {
    console.log(err.response?.data);
    toast.error(err.response?.data?.detail || "Failed");
  }
}}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>

        <button
          onClick={() => setProgressModal(null)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
{delayModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[420px] space-y-4">

      <h3 className="text-xl font-semibold text-center">
        Add Delay Reason
      </h3>

      <input
        type="text"
        placeholder="Enter delay reason"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <div className="flex justify-center gap-4">
        <button
          onClick={async () => {
  try {
    if (!inputValue.trim()) {
      toast.error("Enter delay reason");
      return;
    }

    await API.put(`/works/${delayModal.work_id}/tracker`, {
      tracker: "Delayed"
    });

    await API.put(`/works/${delayModal.work_id}/delay`, {
      reason: inputValue
    });

    toast.success("Delay added");
    setDelayModal(null);
    setInputValue("");
    fetchWorks();

  } catch (err) {
    console.log(err.response?.data);
    toast.error(err.response?.data?.detail || "Failed");
  }
}}
          className="px-4 py-2 bg-yellow-600 text-white rounded"
        >
          Save
        </button>

        <button
          onClick={() => setDelayModal(null)}
          className="px-4 py-2 bg-gray-300 rounded"
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