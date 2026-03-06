import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyAssociates } from "../services/associateService";

function StaffAssociates() {
  const [associates, setAssociates] = useState([]);

  useEffect(() => {
    fetchAssociates();
  }, []);

  const fetchAssociates = async () => {
    try {
      const data = await getMyAssociates();
      setAssociates(data);
    } catch (error) {
      toast.error("Failed to load associates");
    }
  };

  return (
    <div className="h-full flex flex-col">

      <h2 className="text-2xl font-bold text-gray-800">
        My Project Associates
      </h2>
      <div className="flex-1 overflow-y-auto mt-6 pr-2">
      <div className="bg-white shadow rounded-xl overflow-hidden">
        
          <table className="min-w-full text-left">

          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">Associate ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Active</th>
            </tr>
          </thead>

          <tbody>
            {associates.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-6 text-center text-gray-500"
                >
                  No associates found.
                </td>
              </tr>
            ) : (
              associates.map((assoc) => (
                <tr key={assoc.staff_id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {assoc.staff_id}
                  </td>
                  <td className="px-6 py-4">
                    {assoc.name}
                  </td>
                  <td className="px-6 py-4">
                    {assoc.is_active ? (
                      <span className="text-green-600 font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>

          </table>
        </div>   
         
      </div>


  </div>
  );
}

export default StaffAssociates;