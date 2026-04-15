import { useState } from "react";
import { changePassword } from "../services/authService";
import toast from "react-hot-toast";

function ChangePassword() {
  const [password, setPassword] = useState("");
  const staffId = localStorage.getItem("staff_id");

  const handleSubmit = async () => {
    try {
      await changePassword({
        staff_id: staffId,
        new_password: password
      });

      toast.success("Password changed successfully ✅");
      setPassword("");
    } catch (err) {
      toast.error("Failed to change password ❌");
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-xl shadow w-[400px]">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;