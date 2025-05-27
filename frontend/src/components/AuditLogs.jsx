import React from "react";
import { motion } from "framer-motion";

const AuditLogs = ({ logs }) => {
  if (!logs) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-gray-400 py-6"
      >
        No logs available.
      </motion.p>
    );
  }

  if (logs.length === 0) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-gray-400 py-6"
      >
        No logs found.
      </motion.p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-x-auto bg-gray-800 rounded-xl shadow-2xl p-6"
    >
      <h2 className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Audit Logs
      </h2>
      <table className="min-w-full text-gray-100">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-left text-sm font-semibold uppercase tracking-wide">
            <th className="py-4 px-6">Package ID</th>
            <th className="py-4 px-6">Action</th>
            <th className="py-4 px-6">Performed By</th>
            <th className="py-4 px-6">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr
              key={log._id}
              className={`border-t border-gray-700 hover:bg-gray-700 transition-colors duration-200 ${
                index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
              }`}
            >
              <td className="py-4 px-6 text-sm">{log.package || "N/A"}</td>
              <td className="py-4 px-6 text-sm capitalize">{log.action}</td>
              <td className="py-4 px-6 text-sm">{log.userName || "Unknown"}</td>
              <td className="py-4 px-6 text-sm">
                {log.timestamp
                  ? new Date(log.timestamp).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default AuditLogs;