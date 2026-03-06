import { useEffect, useState } from "react";
import {
  getMyAssociates,
  getAllAssociates
} from "../services/associateService";
import toast from "react-hot-toast";
import {
  createWork,
  getAllWorks,
  getStaffWorks,
  getAssociateWorks,   
  deleteWork,
  updateProgress,
  addDelay,
  updateWork,
  restoreWork
} from "../services/workService";

function Works() {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("staff_id");
  const [editingWork, setEditingWork] = useState(null);
  const [works, setWorks] = useState([]);
  const [associates, setAssociates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deletedWorks, setDeletedWorks] = useState([]);
  const [progressModal, setProgressModal] = useState(null);
  const [delayModal, setDelayModal] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const [formData, setFormData] = useState({
    staff_id: "",
    project_name: "",
    objective: "",
    task: "",
    description: "",
    allocated_time: "",
    deadline_time: ""
  });


      useEffect(() => {
        fetchWorks();
        fetchAssociates();
      }, []);

  const fetchWorks = async () => {
  try {
    let data;

    if (role === "admin") {
      data = await getAllWorks();
    } 
    else if (role === "staff") {
      data = await getStaffWorks();
    }
    else if (role === "project-associate") {
      data = await getAssociateWorks();
    }
    else {
      data = [];   
    }

    console.log("All works:", data);

    const safeData = data || [];   

    setWorks(safeData.filter(w => w.is_deleted === false));
    setDeletedWorks(safeData.filter(w => w.is_deleted === true));
    
  } catch (err) {
    toast.error("Failed to load works");
  }
};

  const fetchAssociates = async () => {
  try {
    let data;

    if (role === "admin") {
      data = await getAllAssociates();
    } else if (role === "staff") {
      data = await getMyAssociates();
    }

    setAssociates(data);
  } catch (err) {
    console.log(err);
  }
};

  const handleCreate = async () => {
  try {
    if (!formData.staff_id) {
      toast.error("Select associate");
      return;
    }

    if (editingWork) {
      await updateWork(editingWork.work_id, formData);
      toast.success("Work Updated ✅");
    } else {
      await createWork(formData);
      toast.success("Work Created ");
    }

    setEditingWork(null);
    setShowModal(false);
    fetchWorks();

  } catch (err) {
    toast.error("Operation failed");
  }
};

  const handleEdit = (work) => {
  setEditingWork(work);
  setFormData({
    staff_id: work.staff_id,
    project_name: work.project_name,
    objective: work.objective,
    task: work.task,
    description: work.description,
    allocated_time: work.allocated_time?.slice(0,16),
    deadline_time: work.deadline_time?.slice(0,16)
  });
  setShowModal(true);
};

  const handleDelete = async (id) => {
    try {
      await deleteWork(id);
      toast.success("Work Deleted");
      fetchWorks();
    } catch {
      toast.error("Delete failed");
    }
  };



  const isDeadlineCrossed = (deadline) => {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
};

  return (
    <div className="h-full flex flex-col">

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Works</h2>

        {(role === "admin" || role === "staff") && (
          <button
            onClick={() => {
  setEditingWork(null);
  setFormData({
    staff_id: "",
    project_name: "",
    objective: "",
    task: "",
    description: "",
    allocated_time: "",
    deadline_time: ""
  });
  setShowModal(true);
}}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            + Create Work
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2">

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">Associate ID</th>
              <th className="px-6 py-3">Project</th>
              <th className="px-6 py-3">Task</th>
              <th className="px-6 py-3">Assigned On</th>
              <th className="px-6 py-3">Deadline</th>
              <th className="px-6 py-3">Progress</th>
              <th className="px-6 py-3">Delay Reason</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
  {works.map((work) => (
    <tr key={work.work_id} className="border-t">
      <td className="px-6 py-4 font-medium text-blue-700">
        {work.staff_id}
      </td>

      <td className="px-6 py-4">{work.project_name}</td>

      <td className="px-6 py-4">{work.task}</td>

      <td className="px-6 py-4">
  {work.allocated_time
    ? new Date(work.allocated_time).toLocaleDateString("en-GB")
    : "-"}
</td>

      <td className="px-6 py-4">
  {work.deadline_time
    ? new Date(work.deadline_time).toLocaleDateString("en-GB")
    : "-"}
</td>

      <td className="px-6 py-4">
  {work.progress_description || "-"}
</td>

      {/* ✅ Delay Reason Column */}
      
      <td className="px-6 py-4">
  {work.reason_for_delay ? (
    <span className="text-red-600 font-medium">
      {work.reason_for_delay}
    </span>
  ) : (
    "-"
  )}
</td>

      {/* ✅ Actions Column */}
      <td className="px-6 py-4 space-x-3">

        {/* PROJECT ASSOCIATE ACTIONS */}
        {role === "project-associate" && (
          <>
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
              disabled={!isDeadlineCrossed(work.deadline_time)}
              className={`${
                isDeadlineCrossed(work.deadline_time)
                  ? "text-red-600"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              {work.reason ? "Edit Delay" : "Delay"}
            </button>
          </>
        )}

        {/* ADMIN & STAFF ACTIONS */}
        {(role === "admin" || role === "staff") && (
          <>
            <button
              onClick={() => handleEdit(work)}
              className="text-blue-600"
            >
              Edit
            </button>

            <button
              onClick={() => setDeleteModal(work)}
              className="text-red-600 font-semibold hover:text-red-800"
            >
              Delete
            </button>
          </>
        )}

      </td>

    </tr>
  ))}
</tbody>

        </table>
        </div>   {/* closes bg-white shadow div */}
</div> 

        {deleteModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-[420px] text-center">

      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-100">
          <span className="text-red-600 text-2xl">⚠️</span>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Confirm Deletion
      </h2>

      <p className="text-gray-600 mb-6">
        Are you sure you want to delete
        <span className="font-semibold text-red-600">
          {" "}“{deleteModal.project_name}”
        </span>?
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={async () => {
            try {
              await deleteWork(deleteModal.work_id);
              toast.success("Work Deleted Successfully");
              setDeleteModal(null);
              fetchWorks();
            } catch {
              toast.error("Delete failed");
            }
          }}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Delete
        </button>

        <button
          onClick={() => setDeleteModal(null)}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}
      
      {progressModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[420px] space-y-4 shadow-xl">

      <h3 className="text-xl font-semibold text-center">
        Update Progress
      </h3>

      <input
        type="text"
        placeholder="Enter progress update"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={async () => {
            try {
              await updateProgress(progressModal, {
                progress_description: inputValue
              });
              toast.success("Progress Updated");
              setProgressModal(null);
              fetchWorks();
            } catch {
              toast.error("Update failed");
            }
          }}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Save
        </button>

        <button
          onClick={() => setProgressModal(null)}
          className="px-5 py-2 bg-gray-300 rounded-lg"
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}
      
      {delayModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[420px] space-y-4 shadow-xl">

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

      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={async () => {
            try {
              await addDelay(delayModal.work_id, {
                reason: inputValue
              });
              toast.success("Delay Added");
              setDelayModal(null);
              fetchWorks();
            } catch {
              toast.error("Failed");
            }
          }}
          className="px-5 py-2 bg-yellow-600 text-white rounded-lg"
        >
          Save
        </button>

        <button
          onClick={() => setDelayModal(null)}
          className="px-5 py-2 bg-gray-300 rounded-lg"
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}
      {deletedWorks.length > 0 && (
  <>
    <h3 className="text-xl font-semibold mt-10">
  Deleted Works
</h3>

<div className="bg-white shadow rounded-xl overflow-hidden">
  
    <table className="min-w-full text-left">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-6 py-3">Associate ID</th>
        <th className="px-6 py-3">Project</th>
        <th className="px-6 py-3">Task</th>
        <th className="px-6 py-3">Assigned On</th>
        <th className="px-6 py-3">Deadline</th>
        <th className="px-6 py-3">Progress</th>
        <th className="px-6 py-3">Delay Reason</th>
        <th className="px-6 py-3">Actions</th>
      </tr>
    </thead>

    <tbody>
      {deletedWorks.map((work) => (
        <tr key={work.work_id} className="border-t">
          <td className="px-6 py-4 font-medium text-blue-700">
        {work.staff_id}
      </td>

          <td className="px-6 py-4">{work.project_name}</td>

          <td className="px-6 py-4">{work.task}</td>

          <td className="px-6 py-4">
            {work.allocated_time
              ? new Date(work.allocated_time).toLocaleDateString("en-GB")
              : "-"}
          </td>

          <td className="px-6 py-4">
            {work.deadline_time
              ? new Date(work.deadline_time).toLocaleDateString("en-GB")
              : "-"}
          </td>

          <td className="px-6 py-4">
            {work.progress_description || "-"}
          </td>

          <td className="px-6 py-4">
            {work.reason_for_delay ? (
              <span className="text-red-600 font-medium">
                {work.reason_for_delay}
              </span>
            ) : (
              "-"
            )}
          </td>

          <td className="px-6 py-4">
            <button
              onClick={async () => {
                try {
                  await restoreWork(work.work_id);
                  toast.success("Work Restored");
                  fetchWorks();
                } catch {
                  toast.error("Restore failed");
                }
              }}
              className="text-green-600"
            >
              Restore
            </button>
          </td>

        </tr>
      ))}
    </tbody>
  </table>
  </div>

    </>
      )}


      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[500px] space-y-4">

            <h3 className="text-xl font-bold">
              {editingWork ? "Edit Work" : "Create Work"}
            </h3>

            <select
              className="w-full border p-2 rounded"
              value={formData.staff_id}
              onChange={(e) =>
                setFormData({ ...formData, staff_id: e.target.value })
              }
            >
              <option value="">Select Associate</option>
              {associates.map((a) => (
                <option key={a._id} value={a.staff_id}>
                  {a.staff_id} - {a.name}
                </option>
              ))}
            </select>

            <input
              placeholder="Project Name"
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setFormData({ ...formData, project_name: e.target.value })
              }
            />

            <input
              placeholder="Task"
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setFormData({ ...formData, task: e.target.value })
              }
            />

            <label className="text-sm font-medium">Work Assigned On</label>
<input
  type="datetime-local"
  className="w-full border p-2 rounded"
  onChange={(e) =>
    setFormData({ ...formData, allocated_time: e.target.value })
  }
/>

            <label className="text-sm font-medium">Deadline</label>
            
<input
  type="datetime-local"
  className="w-full border p-2 rounded"
  onChange={(e) =>
    setFormData({ ...formData, deadline_time: e.target.value })
  }
/>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              
                <button
  onClick={handleCreate}
  className="px-4 py-2 bg-blue-600 text-white rounded"
>
  {editingWork ? "Update" : "Create"}
</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}


export default Works;