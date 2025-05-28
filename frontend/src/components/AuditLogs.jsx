const AuditLogs = ({ logs }) => {
  if (!logs) return <p className="text-center">No logs available.</p>;
  if (logs.length === 0) return <p className="text-center">No logs found.</p>;

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow">
        <thead>
          <tr className="bg-gray-100 text-left text-sm text-gray-600">
            <th className="px-4 py-2">Package ID</th>
            <th className="px-4 py-2">Action</th>
            <th className="px-4 py-2">Performed By</th>
            <th className="px-4 py-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id} className="border-t text-sm">
              <td className="px-4 py-2">{log.package}</td>
              <td className="px-4 py-2">{log.action}</td>
              <td className="px-4 py-2">{log.userName}</td>
              <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogs;
