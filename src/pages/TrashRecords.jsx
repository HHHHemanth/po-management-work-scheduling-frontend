import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getDeletedRecords,
  getAdminDeletedRecords,
  restoreRecord
} from "../services/recordService";

function TrashRecords() {
  const [records, setRecords] = useState([]);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeleted();
  }, []);

  const fetchDeleted = async () => {
  try {
    let data;

    if (role === "admin") {
      data = await getAdminDeletedRecords();
    } else {
      const staffId = localStorage.getItem("staff_id");

      data = await getDeletedRecords();

      // ✅ FILTER ONLY THIS STAFF'S RECORDS
      data = data.filter(
        record => String(record.staff_id) === String(staffId)
      );
    }

    setRecords(data);
  } catch (err) {
    console.error("Error fetching deleted records:", err);
  }
};

  const handleRestore = async (id) => {
  try {
    await restoreRecord(id);

    await fetchDeleted();   // ✅ correct function

    toast.success("Record Restored Successfully ✅");
  } catch (error) {
    console.error(error);
    toast.error("Restore failed ❌");
  }
};
  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
  <h2 className="text-2xl font-bold text-gray-800">
    Deleted Records
  </h2>

  <div className="flex space-x-3">
    <button
  onClick={() =>
    navigate(
      role === "admin" ? "/admin/records" : "/staff/records",
      { state: { viewMode: "records" } }
    )
  }
  className="px-4 py-2 bg-gray-300 rounded"
>
  Records
</button>

<button
  onClick={() =>
    navigate(
      role === "admin" ? "/admin/records" : "/staff/records",
      { state: { viewMode: "documents" } }
    )
  }
  className="px-4 py-2 bg-blue-600 text-white rounded"
>
  Documents
</button>
  </div>
</div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">PR/PO No</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">PR Date</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Indenter</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Material</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Project</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Approval ₹</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Utilization ₹</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Remaining ₹</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Staff</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Restore</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-6 py-6 text-center text-gray-500">
                  No deleted records found.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record._id} className="border-t hover:bg-gray-50">

                  <td className="px-6 py-4">{record.pr_po_no}</td>

                  <td className="px-6 py-4">
                    {record.created_at
                      ? new Date(record.created_at).toLocaleDateString("en-GB")
                      : "-"}
                  </td>

                  <td className="px-6 py-4">{record.indenter_name}</td>

                  <td className="px-6 py-4">{record.item_material}</td>

                  <td className="px-6 py-4">{record.project_head}</td>

                  <td className="px-6 py-4">₹ {record.approval_rs}</td>

                  <td className="px-6 py-4">₹ {record.utilization_rs}</td>

                  <td className="px-6 py-4">₹ {record.remaining}</td>

                  <td className="px-6 py-4">{record.staff_id}</td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleRestore(record._id)}
                      className="text-green-600 font-medium hover:underline"
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
  );
}

export default TrashRecords;