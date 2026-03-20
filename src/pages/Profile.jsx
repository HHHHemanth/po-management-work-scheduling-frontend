function Profile() {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const staffId = localStorage.getItem("staff_id");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <div className="bg-white p-6 rounded shadow space-y-3">
        <p><b>Name:</b> {name}</p>
        <p><b>Staff ID:</b> {staffId}</p>
        <p><b>Role:</b> {role}</p>
      </div>
    </div>
  );
}

export default Profile;