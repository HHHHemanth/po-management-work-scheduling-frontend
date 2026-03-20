import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import {
  getAllWorks,
  getStaffWorks,
  getWorkDocuments,
  getAssociateWorks,
  uploadWorkDocument,
  deleteWorkDocument
} from "../services/workService";

function WorkDocuments() {
  const role = localStorage.getItem("role");

  const [works, setWorks] = useState([]);
  const [documentsMap, setDocumentsMap] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedWorkId, setSelectedWorkId] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedWorkForDelete, setSelectedWorkForDelete] = useState(null);
  const [monthFilter, setMonthFilter] = useState("");
  

  useEffect(() => {
    fetchWorks();
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
      data = [];   // ✅ fallback
    }

    const safeData = data || [];

    setWorks(safeData);

    safeData.forEach(work => {
      fetchDocuments(work.work_id);
    });

  } catch {
    toast.error("Failed to load works");
  }
};

  const fetchDocuments = async (workId) => {
    try {
      const docs = await getWorkDocuments(workId);

      setDocumentsMap(prev => ({
        ...prev,
        [workId]: docs
      }));
    } catch {}
  };

  const handleUpload = async () => {
    if (!documentName || !selectedFile) {
      toast.error("Provide document name & file");
      return;
    }

    try {
      await uploadWorkDocument(
        selectedWorkId,
        documentName,
        selectedFile
      );

      toast.success("Uploaded successfully");

      setShowUploadModal(false);
      setDocumentName("");
      setSelectedFile(null);

      fetchDocuments(selectedWorkId);

    } catch {
      toast.error("Upload failed");
    }
  };

  const handleDelete = async (docId, workId) => {
    try {
      await deleteWorkDocument(docId);
      toast.success("Deleted");
      fetchDocuments(workId);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold">Work Documents</h2>
      <div className="flex gap-4 items-center">
  <div className="flex items-center gap-4 bg-blue-50 px-5 py-3 rounded-xl shadow-sm border border-blue-200">

  <span className="text-blue-700 font-semibold text-base">
    📅 Filter by Month
  </span>

  <input
    type="month"
    value={monthFilter}
    onChange={(e) => setMonthFilter(e.target.value)}
    className="px-4 py-2 text-lg rounded-lg border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
  />

  {monthFilter && (
    <button
      onClick={() => setMonthFilter("")}
      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
    >
      Clear
    </button>
  )}
</div>

  
</div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
  <div className="max-h-[60vh] overflow-y-auto">
    <table className="min-w-full text-left">

          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">Associate ID</th>
              <th className="px-6 py-3">Project</th>
              <th className="px-6 py-3">Task</th>
              <th className="px-6 py-3">Documents</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          

          <tbody>
{(() => {

  const filteredWorks = works.map((work) => {
  const docs = documentsMap[work.work_id] || [];

  const filteredDocs = docs.filter((doc) => {
    if (!monthFilter) return true;

    const docDate = new Date(doc.uploaded_at);
    const [year, month] = monthFilter.split("-");

    return (
      docDate.getFullYear() === Number(year) &&
      docDate.getMonth() === Number(month) - 1
    );
  });

  return {
    ...work,
    filteredDocs,
    hasDocsInMonth: filteredDocs.length > 0
  };
});

  const worksToShow = monthFilter
  ? filteredWorks.filter(w => w.hasDocsInMonth)
  : filteredWorks;
  
  if (worksToShow.length === 0) {
  return (
    <tr>
      <td colSpan="5" className="text-center py-6 text-gray-500">
        No documents found
      </td>
    </tr>
  );
}

return worksToShow.map((work) => (
    
    <tr key={work.work_id} className="border-t align-top">

      <td className="px-6 py-4 font-medium">
        {work.staff_id}
      </td>

      <td className="px-6 py-4">
        {work.project_name}
      </td>

      <td className="px-6 py-4">
        {work.task}
      </td>

      <td className="px-6 py-4">
        {work.filteredDocs.map((doc) => (
          <div key={doc.document_id} className="flex gap-3 items-center py-1">

            <span>{doc.document_name}</span>

            <span className="text-xs text-gray-400">
              {new Date(doc.uploaded_at).toLocaleDateString("en-GB")}
            </span>

            <button
              onClick={() => window.open(doc.public_url, "_blank")}
              className="text-blue-600 text-xs"
            >
              VIEW
            </button>

            {(role === "admin" || role === "project-associate") && (
              <button
                onClick={() => {
                  setSelectedDoc(doc);
                  setSelectedWorkForDelete(work.work_id);
                  setConfirmModal(true);
                }}
                className="text-red-600 text-xs"
              >
                DELETE
              </button>
            )}

          </div>
        ))}
      </td>

      <td className="px-6 py-4">
        <button
          onClick={() => {
            setSelectedWorkId(work.work_id);
            setShowUploadModal(true);
          }}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Upload
        </button>
      </td>

    </tr>
  ));
})()}
</tbody>
 </table>


                
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">

            <h3 className="text-xl font-bold">
              Upload Document
            </h3>

            <input
              type="text"
              placeholder="Document Name"
              value={documentName}
              onChange={(e) =>
                setDocumentName(e.target.value)
              }
              className="w-full border p-2 rounded"
            />

            <input
              type="file"
              onChange={(e) =>
                setSelectedFile(e.target.files[0])
              }
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
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Upload
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
          {selectedDoc?.document_name}
        </span>
        ?
      </p>

      <div className="flex justify-center space-x-4 pt-4">
        <button
          onClick={() => {
            handleDelete(
              selectedDoc.document_id,
              selectedWorkForDelete
            );
            setConfirmModal(false);
            setSelectedDoc(null);
          }}
          className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Delete
        </button>

        <button
          onClick={() => {
            setConfirmModal(false);
            setSelectedDoc(null);
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

export default WorkDocuments;