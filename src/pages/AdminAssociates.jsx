import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAssociates,
  createAssociate,
  deleteAssociate,
  restoreAssociate,
  getDeletedAssociates,
  updateAssociate
} from "../services/associateService";
import { getStaffs } from "../services/recordService";

function AdminAssociates() {
  const [associates, setAssociates] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedAssociate, setSelectedAssociate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletedAssociates, setDeletedAssociates] = useState([]);

  const [formData, setFormData] = useState({
  associate_id: "",      // PA004
  assigned_staff: "",    // 003
  name: "",
  password: ""
});



  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  const active = await getAssociates();
  const deleted = await getDeletedAssociates();
  const staffList = await getStaffs();

  setAssociates(active);
  setDeletedAssociates(deleted);
  setStaffs(staffList);
};

  const handleCreate = async () => {
  try {
    setCreating(true);

    // Step 1: Create associate
    await createAssociate({
      staff_id: formData.associate_id,
      name: formData.name,
      password: formData.password
    });

    // Step 2: Assign staff
    await updateAssociate(formData.associate_id, {
      is_active: true,
      assigned_staff: [formData.assigned_staff]
    });

    toast.success("Associate Created & Assigned ✅");

    setShowModal(false);
    fetchData();

  } catch (err) {
    toast.error("Creation failed ❌");
  } finally {
    setCreating(false);
  }
};

  const handleDeleteClick = (assoc) => {
  setSelectedAssociate(assoc);
  setConfirmModal(true);
};

const confirmDelete = async () => {
  try {
    await deleteAssociate(selectedAssociate.staff_id);
    toast.success("Associate moved to Trash");
    setConfirmModal(false);
    setSelectedAssociate(null);
    fetchData();
  } catch (err) {
    toast.error("Delete failed");
  }
};

  const handleRestore = async (id) => {
    try {
      await restoreAssociate(id);
      toast.success("Associate Restored");
      fetchData();
    } catch {
      toast.error("Restore failed");
    }
  };

  
  const activeAssociates = associates;
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Associates</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          + Create Associate
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        
      

      
      
      
    {/* ✅ ACTIVE ASSOCIATES */}
<h3 className="text-xl font-semibold mt-6">
  Active Associates
</h3>

<div className="space-y-4 mt-4">
  {activeAssociates.length === 0 ? (
    <p className="text-gray-500">No active associates</p>
  ) : (
    activeAssociates.map((assoc) => (
      <div
        key={assoc._id}
        className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
      >
        <div>
          <p className="font-medium">
            {assoc.staff_id} — {assoc.name}
          </p>
          <p className="text-green-600 text-sm">Active</p>
        </div>

        <button
          onClick={() => handleDeleteClick(assoc)}
          className="text-red-600"
        >
          Delete
        </button>
      </div>
    ))
  )}
</div> 
{/* ✅ DELETED ASSOCIATES */}
<h3 className="text-xl font-semibold mt-10">
  Deleted Associates (Auto deletes after 5 days)
</h3>

<div className="bg-white shadow rounded-xl overflow-hidden mt-4">
  <table className="min-w-full text-left">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-6 py-3">Associate ID</th>
        <th className="px-6 py-3">Name</th>
        <th className="px-6 py-3">Restore</th>
      </tr>
    </thead>

    <tbody>
      {deletedAssociates.length === 0 ? (
        <tr>
          <td colSpan="3" className="px-6 py-6 text-center text-gray-500">
            No deleted associates
          </td>
        </tr>
      ) : (
        deletedAssociates.map((assoc) => (
          <tr key={assoc._id} className="border-t">
            <td className="px-6 py-4">{assoc.staff_id}</td>
            <td className="px-6 py-4">{assoc.name}</td>
            <td className="px-6 py-4">
              <button
                onClick={() => handleRestore(assoc.staff_id)}
                className="text-green-600"
              >
                Restore
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

</div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold">Create Associate</h3>

            <select
  value={formData.assigned_staff}
  onChange={(e) =>
    setFormData({ ...formData, assigned_staff: e.target.value })
  }
  
>
              <option value="">Select Staff</option>
              {staffs.map((staff) => (
                <option key={staff.staff_id} value={staff.staff_id}>
                  {staff.staff_id} - {staff.name}
                </option>
              ))}
            </select>
            
            <input
              type="text"
              placeholder="Associate ID (PA004)"
              value={formData.associate_id}
              onChange={(e) =>
                setFormData({ ...formData, associate_id: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
                        
            <input
              type="text"
              placeholder="Associate Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border p-2 rounded"
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
                disabled={creating}
                className="px-4 py-2 bg-purple-600 text-white rounded"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
{confirmModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[400px] text-center space-y-4 shadow-xl">

      <div className="flex justify-center">
        <div className="bg-red-100 p-4 rounded-full">
          ⚠️
        </div>
      </div>

      <h3 className="text-xl font-semibold">
        Confirm Deletion
      </h3>

      <p className="text-gray-600">
        Are you sure you want to delete{" "}
        <span className="text-red-600 font-semibold">
          {selectedAssociate?.name}
        </span>
        ?
      </p>

      <div className="flex justify-center space-x-4 pt-4">
        <button
          onClick={confirmDelete}
          className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Delete
        </button>

        <button
          onClick={() => {
            setConfirmModal(false);
            setSelectedAssociate(null);
          }}
          className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}

    </div>
  );
}

export default AdminAssociates;