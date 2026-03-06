import { useState, useEffect } from "react";

import toast from "react-hot-toast";
import { createStaff } from "../services/recordService";
import {
  getStaffs,
  deleteStaff,
  getDeletedStaffs,
  restoreStaff
} from "../services/recordService";

function AdminUsers() {
  const [deletingStaff, setDeletingStaff] = useState(false);
  const [deletingDoc, setDeletingDoc] = useState(false);
  const [deleteStaffModal, setDeleteStaffModal] = useState(null);
  const [staffs, setStaffs] = useState([]);
  const [deletedStaffs, setDeletedStaffs] = useState([]);
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [newStaff, setNewStaff] = useState({
    staff_id: "",
    name: "",
    password: ""
  });

  useEffect(() => {
    fetchStaffs();
    fetchDeleted();
  }, []);

  const fetchStaffs = async () => {
    const data = await getStaffs();
    setStaffs(data.filter(s => !s.staff_id.startsWith("PA")));
  };

  const fetchDeleted = async () => {
  const data = await getDeletedStaffs();

  // 🔥 Remove project associates (PAxxx)
  setDeletedStaffs(
    data.filter(s => !s.staff_id.startsWith("PA"))
  );
};

  const handleDelete = async (id) => {
    await deleteStaff(id);
    fetchStaffs();
    fetchDeleted();
  };

  const handleRestore = async (id) => {
    try {
      await restoreStaff(id);
      fetchStaffs();
      fetchDeleted();
      toast.success("Staff Restored Successfully ✅");
    } catch (error) {
      toast.error("Restore failed ❌");
    }
  };

    const handleCreateStaff = async () => {

  try {
    const { staff_id, name, password } = newStaff;

    if (!staff_id || !name || !password) {
      alert("All fields required");
      return;
    }

    setCreating(true); // 🔄 start loading

    await createStaff(newStaff);

    toast.success("Staff Created Successfully ✅");

    setShowModal(false);
    setNewStaff({
      staff_id: "",
      name: "",
      password: ""
    });

    fetchStaffs();
    fetchDeleted();

  } catch (error) {
    toast.error("Creation failed ❌");
  } finally {
    setCreating(false); // stop loading
  }
};

  return (
    <div className="h-full flex flex-col">

      <h2 className="text-3xl font-bold text-gray-800">
        Staff Management
      </h2>

      {/* Active Staff Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
  <h3 className="text-xl font-semibold">Active Staff</h3>

  <button
    onClick={() => setShowModal(true)}
    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  >
    + Create Staff
  </button>
</div>

<div className="flex-1 overflow-y-auto space-y-10 pr-2">

        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="max-h-[60vh] overflow-y-auto">
            <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3">Staff ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {staffs.map((staff) => (
                <tr key={staff.staff_id} className="border-t">
                  <td className="px-6 py-4">{staff.staff_id}</td>
                  <td className="px-6 py-4">{staff.name}</td>
                  <td className="px-6 py-4">
                    <button
                  
                      onClick={() => setDeleteStaffModal(staff)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {staffs.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-6 text-center text-gray-500">
                    No active staff found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
                
      </div>
      </div>

      {/* Deleted Staff Table */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Deleted Staff (Auto deletes after 5 days)
        </h3>

        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="max-h-[60vh] overflow-y-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3">Staff ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Restore</th>
              </tr>
            </thead>

            <tbody>
              {deletedStaffs.map((staff) => (
                <tr key={staff.staff_id} className="border-t bg-red-50">
                  <td className="px-6 py-4">{staff.staff_id}</td>
                  <td className="px-6 py-4">{staff.name}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleRestore(staff.staff_id)}
                      className="text-green-600 hover:underline"
                    >
                      Restore
                    </button>
                  </td>
                </tr>
              ))}

              {deletedStaffs.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-6 text-center text-gray-500">
                    No deleted staff.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
              </div>
        </div>
      </div>

      </div>
      
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">

      <h3 className="text-xl font-bold">Create New Staff</h3>

      <input
        type="text"
        placeholder="Staff ID"
        value={newStaff.staff_id}
        onChange={(e) =>
          setNewStaff({ ...newStaff, staff_id: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Name"
        value={newStaff.name}
        onChange={(e) =>
          setNewStaff({ ...newStaff, name: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={newStaff.password}
        onChange={(e) =>
          setNewStaff({ ...newStaff, password: e.target.value })
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
  onClick={handleCreateStaff}
  disabled={creating}
  className={`px-4 py-2 rounded text-white ${
    creating
      ? "bg-blue-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {creating ? "Creating..." : "Create"}
</button>

      </div>

    </div>
  </div>
)}

{deleteStaffModal && (
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
          {" "}“{deleteStaffModal.name}”
        </span>?
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={async () => {
            try {
              setDeletingStaff(true);

              await deleteStaff(deleteStaffModal.staff_id);
              await fetchStaffs();
              await fetchDeleted();

              setDeleteStaffModal(null);
              toast.success("Staff Deleted Successfully");
            } catch (err) {
              toast.error("Delete failed");
            } finally {
              setDeletingStaff(false);
            }
          }}
          disabled={deletingStaff}
          className={`px-6 py-2 rounded-lg text-white transition ${
            deletingStaff
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {deletingStaff ? "Deleting..." : "Delete"}
        </button>

        <button
          onClick={() => setDeleteStaffModal(null)}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
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

export default AdminUsers;