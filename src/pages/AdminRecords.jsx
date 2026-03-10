import API from "../services/api";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  uploadDocument,
  getDocuments,
  viewDocument,
  deleteDocument
} from "../services/recordService";
import { getRecords, createRecord, deleteRecord, updateRecord } from "../services/recordService";
import { useNavigate } from "react-router-dom";
import { getStaffs } from "../services/recordService";
import { useLocation } from "react-router-dom";


function AdminRecords() {
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentsMap, setDocumentsMap] = useState({});
  const location = useLocation();
  const [records, setRecords] = useState([]);
  const [staffs, setStaffs] = useState([]);

  const [viewMode, setViewMode] = useState(
    location.state?.viewMode || "records"
      );
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteRecordModal, setDeleteRecordModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadRecordId, setUploadRecordId] = useState(null);


  const [formData, setFormData] = useState({
    indenter_name: "",
    item_material: "",
    project_head: "",
    description: "",
    pr_po_no: "",
    approval_rs: "",
    utilization_rs: "",
    purpose: "",
    staff_id: "",
    created_at: ""
    });

  

  const [editingId, setEditingId] = useState(null);

  const role = localStorage.getItem("role");
  const staffId = localStorage.getItem("staff_id"); 
  const staffName = localStorage.getItem("name") || "";
  const navigate = useNavigate();

  useEffect(() => {
  fetchRecords();

  if (role === "admin") {
    fetchStaffs();
  }
}, []);

  useEffect(() => {
  if (viewMode === "documents" && records.length > 0) {
    records.forEach(record => {
      if (!documentsMap[record._id]) {
        fetchDocumentsForRecord(record._id);
      }
    } 
  );
  }
}, [viewMode, records, ]);

  const fetchRecords = async () => {
    try {
      const data = await getRecords();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  const handleDocumentDelete = (recordId, doc) => {
  setDeleteModal({ recordId, doc });
};
      

  const fetchStaffs = async () => {
    try {
      const data = await getStaffs();
      setStaffs(data);
    } catch (error) {
      console.error("Error fetching staffs:", error);
    }
  };

  const handleCreate = async () => {
  try {
    if (!formData.created_at) {
      alert("Please select PR Date");
      return;
    }

    if (role === "admin" && !formData.staff_id) {
      alert("Please enter Staff ID");
      return;
    }

    setSaving(true); // 🔄 start loading

    let payload = {
      indenter_name: role === "admin" ? formData.indenter_name : staffName,
      item_material: formData.item_material,
      project_head: formData.project_head,
      description: formData.description,
      pr_po_no: formData.pr_po_no,
      approval_rs: Number(formData.approval_rs) || 0,
      utilization_rs: Number(formData.utilization_rs) || 0,
      purpose: formData.purpose,
      staff_id: role === "admin" ? formData.staff_id : staffId,
      created_at: (() => {
        const date = new Date(formData.created_at);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      })()
    };

    if (editingId) {
      await updateRecord(editingId, payload);
      toast.success("Record Updated Successfully ✅");
    } else {
      await createRecord(payload);
      toast.success("Record Created Successfully ✅");
    }

    setShowModal(false);
    setEditingId(null);
    await fetchRecords();


  } catch (error) {
    toast.error("Save failed ");
  } finally {
    setSaving(false); //
  }
};

  const handleDelete = async (id) => {
    try {
      await deleteRecord(id);
      await fetchRecords();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleUpload = async () => {
      if (!documentName || !selectedFile) {
        alert("Please provide document name and file");
        return;
      }

      try {
        setUploading(true);   // 🔥 start loading

        await uploadDocument(
          uploadRecordId,
          documentName,
          selectedFile
        );

        setShowUploadModal(false);
        setDocumentName("");
        setSelectedFile(null);

        fetchDocumentsForRecord(uploadRecordId);

        toast.success("Document Uploaded Successfully");  // success popup

      } catch (error) {
        console.log("Upload error:", error);
        toast.error("Upload failed");
      } finally {
        setUploading(false);  // 🔥 stop loading
      }
    };
  
  const fetchDocumentsForRecord = async (recordId) => {
  try {
    const docs = await getDocuments(recordId);

    setDocumentsMap(prev => ({
      ...prev,
      [recordId]: docs
    }));

  } catch (err) {
    console.error("Error fetching documents:", err);
  }
};


  return (
    <div className="space-y-6">
    <div className="flex justify-between items-center">
  <h2 className="text-2xl font-bold text-gray-800">
    {viewMode === "records" ? "Records" : "Documents"}
  </h2>

  <div className="flex space-x-3">

    <button
      onClick={() => setViewMode("records")}
      className={`px-4 py-2 rounded ${
        viewMode === "records"
          ? "bg-blue-600 text-white"
          : "bg-gray-300"
      }`}
    >
      Records
    </button>

    <button
      onClick={() => setViewMode("documents")}
      className={`px-4 py-2 rounded ${
        viewMode === "documents"
          ? "bg-blue-600 text-white"
          : "bg-gray-300"
      }`}
    >
      Documents
    </button>

    {viewMode === "records" && (
  <button
    onClick={() =>
      navigate(role === "admin" ? "/admin/trash" : "/staff/trash")
    }
    className="px-4 py-2 bg-gray-700 text-white rounded"
  >
    View Trash
  </button>
)}

    {viewMode === "records" && (
      <button
        onClick={() => {
          setEditingId(null);
          setFormData({
            indenter_name: "",
            item_material: "",
            project_head: "",
            description: "",
            pr_po_no: "",
            approval_rs: "",
            utilization_rs: "",
            purpose: "",
            staff_id: "",
            created_at: ""
          });
          setShowModal(true);
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        + Create Record
      </button>
    )}

  </div>
</div>



      {viewMode === "records" && (
        <div className="bg-white shadow rounded-xl overflow-hidden h-[70vh] flex flex-col">

          <div className="overflow-y-auto flex-1">
            <table className="min-w-full text-left">

              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">PR/PO No</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">PR Date</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Indenter</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Material</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Budget Head</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Approval ₹</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Utilization ₹</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Remaining ₹</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Staff</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
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
                    <td className="px-6 py-4 space-x-3">
                      {(role === "admin" || record.staff_id === staffId) && (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(record._id);
                              setFormData({
                                ...record,
                                created_at: record.created_at?.split("T")[0] || ""
                              });
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:underline mr-3"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => setDeleteRecordModal(record)}
                            className="text-red-600 hover:underline"
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
          </div>
        </div>
      )}

      {viewMode === "documents" && (
        <div className="bg-white shadow rounded-xl overflow-hidden h-[70vh] flex flex-col">

          <div className="overflow-y-auto flex-1">
            <table className="min-w-full text-left">

              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3">PR No</th>
                  <th className="px-6 py-3">Indenter</th>
                  <th className="px-6 py-3">Documents</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr key={record._id} className="border-t align-top">

                    <td className="px-6 py-4">{record.pr_po_no}</td>
                    <td className="px-6 py-4">{record.indenter_name}</td>

                    {/* DOCUMENT NAME COLUMN */}
                    <td className="px-6 py-4">
                      {documentsMap[record._id]?.length > 0 ? (
                        documentsMap[record._id].map((doc) => (
                          <div key={doc.document_id} className="py-1">
                            {doc.document_name}
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col gap-2">
                          <span className="text-gray-500">No Documents</span>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setUploadRecordId(record._id);
                          setShowUploadModal(true);
                        }}
                        className="mt-3 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                      >
                        Upload
                      </button>
                    </td>

                    {/* ACTION COLUMN */}
                    <td className="px-6 py-4 text-center">
                      {documentsMap[record._id]?.length > 0 ? (
                        documentsMap[record._id].map((doc) => (
                          <div
                            key={doc.document_id}
                            className="flex justify-center gap-6 py-1"
                          >
                            <button
                              onClick={async () => {
                                const fileUrl = await viewDocument(
                                  record._id,
                                  doc.document_id
                                );
                                window.open(fileUrl, "_blank");
                              }}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              VIEW
                            </button>

                            <button
                              onClick={() =>
                                handleDocumentDelete(record._id, doc)
                              }
                              className="text-red-600 hover:underline text-sm"
                            >
                              DELETE
                            </button>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}
      {showModal && (
        
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">

            <h3 className="text-xl font-bold">
              {editingId ? "Update Record" : "Create Record"}
            </h3>


            <div className="space-y-3">

  {role === "admin" ? (
      <input
        type="text"
        value={formData.indenter_name}
        disabled
        className="w-full border p-2 rounded bg-gray-100"
      />
    ) : (
      <input
        type="text"
        value={staffName}
        disabled
        className="w-full border p-2 rounded bg-gray-100"
      />
    )}

  <input
    type="text"
    placeholder="Item Material"
    value={formData.item_material}
    onChange={(e) =>
      setFormData({ ...formData, item_material: e.target.value })
    }
    className="w-full border p-2 rounded"
  />

  <input
    type="text"
    placeholder="Project Head"
    value={formData.project_head}
    onChange={(e) =>
      setFormData({ ...formData, project_head: e.target.value })
    }
    className="w-full border p-2 rounded"
  />

  <input
    type="text"
    placeholder="Description"
    value={formData.description}
    onChange={(e) =>
      setFormData({ ...formData, description: e.target.value })
    }
    className="w-full border p-2 rounded"
  />

  <input
    type="text"
    placeholder="PR/PO Number"
    value={formData.pr_po_no}
    onChange={(e) =>
      setFormData({ ...formData, pr_po_no: e.target.value })
    }
    className="w-full border p-2 rounded"
  />

  <input
    type="date"
    value={formData.created_at}
    onChange={(e) =>
      setFormData({ ...formData, created_at: e.target.value })
    }
    className="w-full border p-2 rounded"
  />

  <input
    type="number"
    placeholder="Approval Amount"
    value={formData.approval_rs}
    onChange={(e) =>
      setFormData({ ...formData, approval_rs: Number(e.target.value) })
    }
    className="w-full border p-2 rounded"
  />

  <input
    type="number"
    placeholder="Utilization Amount"
    value={formData.utilization_rs}
    onChange={(e) =>
      setFormData({ ...formData, utilization_rs: Number(e.target.value) })
    }
    className="w-full border p-2 rounded"
  />

  {role === "admin" && (
      <select
        value={formData.staff_id}
        onChange={(e) => {
          const selectedId = e.target.value;
          const selectedStaff = staffs.find(
            (staff) => staff.staff_id === selectedId
          );

          setFormData({
            ...formData,
            staff_id: selectedId,
            indenter_name: selectedStaff ? selectedStaff.name : ""
          });
        }}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Staff</option>

        {staffs.map((staff) => (
          <option key={staff.staff_id} value={staff.staff_id}>
            {staff.staff_id} - {staff.name}
          </option>
        ))}
      </select>
    )}


  <input
    type="text"
    placeholder="Purpose"
    value={formData.purpose}
    onChange={(e) =>
      setFormData({ ...formData, purpose: e.target.value })
    }
    className="w-full border p-2 rounded"
  />
  

</div>


            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                disabled={saving}
                className={`px-4 py-2 rounded text-white ${
                  saving
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>

          </div>
        </div>
      )}

    {showUploadModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">

      <h3 className="text-xl font-bold">Upload Document</h3>

      <input
  type="text"
  placeholder="Document Name"
  value={documentName}
  onChange={(e) => setDocumentName(e.target.value)}
  className="w-full border p-2 rounded"
/>

<input
  type="file"
  onChange={(e) => setSelectedFile(e.target.files[0])}
  className="w-full border p-2 rounded"
/>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setShowUploadModal(false)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`px-4 py-2 rounded text-white ${
            uploading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

    </div>
  </div>
)}

{deleteModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-[450px] text-center animate-scaleIn">

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
          {" "}“{deleteModal.doc.document_name}”
        </span>?
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={async () => {
            try {
              await deleteDocument(deleteModal.doc.document_id);
              await fetchDocumentsForRecord(deleteModal.recordId);
              setDeleteModal(null);
              toast.success("Document Deleted Successfully");
            } catch (err) {
              toast.error("Delete failed");
            }
          }}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Delete
        </button>

        <button
          onClick={() => setDeleteModal(null)}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}

{deleteRecordModal && (
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
          {" "}“{deleteRecordModal.pr_po_no}”
        </span>?
      </p>

      <div className="flex justify-center gap-4">
        <button
        onClick={async () => {
          try {
            setDeleting(true);
            await deleteRecord(deleteRecordModal._id);
            await fetchRecords();
            setDeleteRecordModal(null);
            toast.success("Record Deleted Successfully");
          } catch (err) {
            toast.error("Delete failed");
          } finally {
            setDeleting(false);
          }
        }}
        disabled={deleting}
        className={`px-6 py-2 rounded-lg text-white transition ${
          deleting
            ? "bg-red-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
              

        <button
          onClick={() => setDeleteRecordModal(null)}
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


import API from "../services/api";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  uploadDocument,
  getDocuments,
  viewDocument,
  deleteDocument
} from "../services/recordService";
import { getRecords, createRecord, deleteRecord, updateRecord } from "../services/recordService";
import { useNavigate } from "react-router-dom";
import { getStaffs } from "../services/recordService";
import { useLocation } from "react-router-dom";


function AdminRecords() {
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentsMap, setDocumentsMap] = useState({});
  const location = useLocation();
  const [records, setRecords] = useState([]);
  const [staffs, setStaffs] = useState([]);

  const [viewMode, setViewMode] = useState(
    location.state?.viewMode || "records"
      );
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteRecordModal, setDeleteRecordModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadRecordId, setUploadRecordId] = useState(null);


  const [formData, setFormData] = useState({
    indenter_name: "",
    item_material: "",
    project_head: "",
    description: "",
    pr_po_no: "",
    approval_rs: "",
    utilization_rs: "",
    purpose: "",
    staff_id: "",
    created_at: ""
    });

  

  const [editingId, setEditingId] = useState(null);

  const role = localStorage.getItem("role");
  const staffId = localStorage.getItem("staff_id"); 
  const staffName = localStorage.getItem("name") || "";
  const navigate = useNavigate();

  useEffect(() => {
  fetchRecords();

  if (role === "admin") {
    fetchStaffs();
  }
}, []);

  useEffect(() => {
  if (viewMode === "documents" && records.length > 0) {
    records.forEach(record => {
      if (!documentsMap[record._id]) {
        fetchDocumentsForRecord(record._id);
      }
    } 
  );
  }
}, [viewMode, records, ]);

  const fetchRecords = async () => {
    try {
      const data = await getRecords();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  const handleDocumentDelete = (recordId, doc) => {
  setDeleteModal({ recordId, doc });
};
      

  const fetchStaffs = async () => {
    try {
      const data = await getStaffs();
      setStaffs(data);
    } catch (error) {
      console.error("Error fetching staffs:", error);
    }
  };

  const handleCreate = async () => {
  try {
    if (!formData.created_at) {
      alert("Please select PR Date");
      return;
    }

    if (role === "admin" && !formData.staff_id) {
      alert("Please enter Staff ID");
      return;
    }

    setSaving(true); // 🔄 start loading

    let payload = {
      indenter_name: role === "admin" ? formData.indenter_name : staffName,
      item_material: formData.item_material,
      project_head: formData.project_head,
      description: formData.description,
      pr_po_no: formData.pr_po_no,
      approval_rs: Number(formData.approval_rs) || 0,
      utilization_rs: Number(formData.utilization_rs) || 0,
      purpose: formData.purpose,
      staff_id: role === "admin" ? formData.staff_id : staffId,
      created_at: (() => {
        const date = new Date(formData.created_at);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      })()
    };

    if (editingId) {
      await updateRecord(editingId, payload);
      toast.success("Record Updated Successfully ✅");
    } else {
      await createRecord(payload);
      toast.success("Record Created Successfully ✅");
    }

    setShowModal(false);
    setEditingId(null);
    await fetchRecords();


  } catch (error) {
    toast.error("Save failed ");
  } finally {
    setSaving(false); //
  }
};

  const handleDelete = async (id) => {
    try {
      await deleteRecord(id);
      await fetchRecords();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleUpload = async () => {
      if (!documentName || !selectedFile) {
        alert("Please provide document name and file");
        return;
      }

      try {
        setUploading(true);   // 🔥 start loading

        await uploadDocument(
          uploadRecordId,
          documentName,
          selectedFile
        );

        setShowUploadModal(false);
        setDocumentName("");
        setSelectedFile(null);

        fetchDocumentsForRecord(uploadRecordId);

        toast.success("Document Uploaded Successfully");  // success popup

      } catch (error) {
        console.log("Upload error:", error);
        toast.error("Upload failed");
      } finally {
        setUploading(false);  // 🔥 stop loading
      }
    };
  
  const fetchDocumentsForRecord = async (recordId) => {
  try {
    const docs = await getDocuments(recordId);

    setDocumentsMap(prev => ({
      ...prev,
      [recordId]: docs
    }));

  } catch (err) {
    console.error("Error fetching documents:", err);
  }
};


  return (
    <div className="space-y-6">
    <div className="flex justify-between items-center">
  <h2 className="text-2xl font-bold text-gray-800">
    {viewMode === "records" ? "Records" : "Documents"}
  </h2>

  <div className="flex space-x-3">

    <button
      onClick={() => setViewMode("records")}
      className={`px-4 py-2 rounded ${
        viewMode === "records"
          ? "bg-blue-600 text-white"
          : "bg-gray-300"
      }`}
    >
      Records
    </button>

    <button
      onClick={() => setViewMode("documents")}
      className={`px-4 py-2 rounded ${
        viewMode === "documents"
          ? "bg-blue-600 text-white"
          : "bg-gray-300"
      }`}
    >
      Documents
    </button>

    {viewMode === "records" && (
  <button
    onClick={() =>
      navigate(role === "admin" ? "/admin/trash" : "/staff/trash")
    }
    className="px-4 py-2 bg-gray-700 text-white rounded"
  >
    View Trash
  </button>
)}

    {viewMode === "records" && (
      <button
        onClick={() => {
          setEditingId(null);
          setFormData({
            indenter_name: "",
            item_material: "",
            project_head: "",
            description: "",
            pr_po_no: "",
            approval_rs: "",
            utilization_rs: "",
            purpose: "",
            staff_id: "",
            created_at: ""
          });
          setShowModal(true);
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        + Create Record
      </button>
    )}

  </div>
</div>



      {viewMode === "records" && (
        <div className="bg-white shadow rounded-xl overflow-hidden h-[70vh] flex flex-col">

          <div className="overflow-y-auto flex-1">
            <table className="min-w-full text-left">

              <thead className="bg-gray-100 sticky top-0 z-10">
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
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
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
                    <td className="px-6 py-4 space-x-3">
                      {(role === "admin" || record.staff_id === staffId) && (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(record._id);
                              setFormData({
                                ...record,
                                created_at: record.created_at?.split("T")[0] || ""
                              });
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:underline mr-3"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => setDeleteRecordModal(record)}
                            className="text-red-600 hover:underline"
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
          </div>
        </div>
      )}

      {viewMode === "documents" && (
        <div className="bg-white shadow rounded-xl overflow-hidden h-[70vh] flex flex-col">

          <div className="overflow-y-auto flex-1">
            <table className="min-w-full text-left">

              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3">PR No</th>
                  <th className="px-6 py-3">Indenter</th>
                  <th className="px-6 py-3">Documents</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr key={record._id} className="border-t align-top">

                    <td className="px-6 py-4">{record.pr_po_no}</td>
                    <td className="px-6 py-4">{record.indenter_name}</td>

                    {/* DOCUMENT NAME COLUMN */}
                    <td className="px-6 py-4">
                      {documentsMap[record._id]?.length > 0 ? (
                        documentsMap[record._id].map((doc) => (
                          <div key={doc.document_id} className="py-1">
                            {doc.document_name}
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col gap-2">
                          <span className="text-gray-500">No Documents</span>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setUploadRecordId(record._id);
                          setShowUploadModal(true);
                        }}
                        className="mt-3 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                      >
                        Upload
                      </button>
                    </td>

                    {/* ACTION COLUMN */}
                    <td className="px-6 py-4 text-center">
                      {documentsMap[record._id]?.length > 0 ? (
                        documentsMap[record._id].map((doc) => (
                          <div
                            key={doc.document_id}
                            className="flex justify-center gap-6 py-1"
                          >
                            <button
                              onClick={async () => {
                                const fileUrl = await viewDocument(
                                  record._id,
                                  doc.document_id
                                );
                                window.open(fileUrl, "_blank");
                              }}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              VIEW
                            </button>

                            <button
                              onClick={() =>
                                handleDocumentDelete(record._id, doc)
                              }
                              className="text-red-600 hover:underline text-sm"
                            >
                              DELETE
                            </button>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}
      {showModal && (
        
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">

            <h3 className="text-xl font-bold">
              {editingId ? "Update Record" : "Create Record"}
            </h3>


            <div className="space-y-3">

  {role === "admin" ? (
      <input
        type="text"
        value={formData.indenter_name}
        disabled
        className="w-full border p-2 rounded bg-gray-100"
      />
    ) : (
      <input
        type="text"
        value={staffName}
        disabled
        className="w-full border p-2 rounded bg-gray-100"
      />
    )}

  <input
    type="text"
    placeholder="Item Material"
    value={formData.item_material}
    onChange={(e) =>
      setFormData({ ...formData, item_material: e.target.value })
    }
    className="w-full border p-2 rounded"
  />

  <input
    type="text"
    placeholder="Project Head"
    value={formData.project_head}
    onChange={(e) =>
      setFormData({ ...formData, project_head: e.target.value })
    }
    className="w-full border p-2 rounded"
  />

  <input
    type="text"
    placeholder="Description"
    value={formData.description}
    onChange={(e) =>
      setFormData({ ...formData, description: e.target.value })
    }
    className="w-full border p-2 rounded"
  />

  <input
    type="text"
    placeholder="PR/PO Number"
    value={formData.pr_po_no}
    onChange={(e) =>
      setFormData({ ...formData, pr_po_no: e.target.value })
    }
    className="w-full border p-2 rounded"
  />

  <input
    type="date"
    value={formData.created_at}
    onChange={(e) =>
      setFormData({ ...formData, created_at: e.target.value })
    }
    className="w-full border p-2 rounded"
  />

  <input
    type="number"
    placeholder="Approval Amount"
    value={formData.approval_rs}
    onChange={(e) =>
      setFormData({ ...formData, approval_rs: Number(e.target.value) })
    }
    className="w-full border p-2 rounded"
  />

  <input
    type="number"
    placeholder="Utilization Amount"
    value={formData.utilization_rs}
    onChange={(e) =>
      setFormData({ ...formData, utilization_rs: Number(e.target.value) })
    }
    className="w-full border p-2 rounded"
  />

  {role === "admin" && (
      <select
        value={formData.staff_id}
        onChange={(e) => {
          const selectedId = e.target.value;
          const selectedStaff = staffs.find(
            (staff) => staff.staff_id === selectedId
          );

          setFormData({
            ...formData,
            staff_id: selectedId,
            indenter_name: selectedStaff ? selectedStaff.name : ""
          });
        }}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Staff</option>

        {staffs.map((staff) => (
          <option key={staff.staff_id} value={staff.staff_id}>
            {staff.staff_id} - {staff.name}
          </option>
        ))}
      </select>
    )}


  <input
    type="text"
    placeholder="Purpose"
    value={formData.purpose}
    onChange={(e) =>
      setFormData({ ...formData, purpose: e.target.value })
    }
    className="w-full border p-2 rounded"
  />
  

</div>


            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                disabled={saving}
                className={`px-4 py-2 rounded text-white ${
                  saving
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>

          </div>
        </div>
      )}

    {showUploadModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">

      <h3 className="text-xl font-bold">Upload Document</h3>

      <input
  type="text"
  placeholder="Document Name"
  value={documentName}
  onChange={(e) => setDocumentName(e.target.value)}
  className="w-full border p-2 rounded"
/>

<input
  type="file"
  onChange={(e) => setSelectedFile(e.target.files[0])}
  className="w-full border p-2 rounded"
/>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setShowUploadModal(false)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`px-4 py-2 rounded text-white ${
            uploading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

    </div>
  </div>
)}

{deleteModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-[450px] text-center animate-scaleIn">

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
          {" "}“{deleteModal.doc.document_name}”
        </span>?
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={async () => {
            try {
              await deleteDocument(deleteModal.doc.document_id);
              await fetchDocumentsForRecord(deleteModal.recordId);
              setDeleteModal(null);
              toast.success("Document Deleted Successfully");
            } catch (err) {
              toast.error("Delete failed");
            }
          }}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Delete
        </button>

        <button
          onClick={() => setDeleteModal(null)}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}

{deleteRecordModal && (
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
          {" "}“{deleteRecordModal.pr_po_no}”
        </span>?
      </p>

      <div className="flex justify-center gap-4">
        <button
        onClick={async () => {
          try {
            setDeleting(true);
            await deleteRecord(deleteRecordModal._id);
            await fetchRecords();
            setDeleteRecordModal(null);
            toast.success("Record Deleted Successfully");
          } catch (err) {
            toast.error("Delete failed");
          } finally {
            setDeleting(false);
          }
        }}
        disabled={deleting}
        className={`px-6 py-2 rounded-lg text-white transition ${
          deleting
            ? "bg-red-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
              

        <button
          onClick={() => setDeleteRecordModal(null)}
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

export default AdminRecords;
