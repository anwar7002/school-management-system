export const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Students</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">1,234</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Present Today</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">1,100</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Absent Today</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">134</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Pending Violations</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">8</p>
        </div>
      </div>
    </div>
  );
};
