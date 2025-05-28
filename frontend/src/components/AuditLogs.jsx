const AuditLogs = ({ logs }) => {
  if (!logs) return <p className="text-center text-gray-500 mt-4">No logs available.</p>;
  if (logs.length === 0) return <p className="text-center text-gray-500 mt-4">No logs found.</p>;

  return (
    <div className="overflow-x-auto p-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-md border border-blue-100">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">Audit Logs</h2>
      <table className="min-w-full table-auto text-sm text-left text-blue-900">
        <thead className="bg-blue-50 border-b border-blue-200">
          <tr>
            <th className="px-4 py-2 font-medium">Package ID</th>
            <th className="px-4 py-2 font-medium">Action</th>
            <th className="px-4 py-2 font-medium">Performed By</th>
            <th className="px-4 py-2 font-medium">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr
              key={log._id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-blue-50"
              } hover:bg-blue-100 transition`}
            >
              <td className="px-4 py-2">{log.package}</td>
              <td className="px-4 py-2">{log.action}</td>
              <td className="px-4 py-2">{log.userName}</td>
              <td className="px-4 py-2 text-gray-600">
                {new Date(log.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogs;
