function AssociateDashboard() {
  const name = localStorage.getItem("staff_id");

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2">
          Welcome {name}
        </h2>
        <p className="text-gray-600">
          You can manage your assigned works, update progress,
          and add delay reasons if deadlines are crossed.
        </p>
      </div>
    </div>
  );
}

export default AssociateDashboard;