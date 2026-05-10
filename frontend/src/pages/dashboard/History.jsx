import { Eye, Trash } from "lucide-react";
import Visualize from "./Visualize";
import { useAuth } from "../../context/AuthContext";

const History = () => {
  const {
    filteredFiles,
    searchQuery,
    loading,
    handleSearch,
    handleView,
    handleDeletefile,
    getStatusIcon,
  } = useAuth();

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
          File History
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search files by name..."
            className="px-5 py-3 border border-blue-300 rounded-lg w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <p className="text-center text-gray-600 text-2xl font-medium animate-pulse">
              Loading File History...
            </p>
          </div>
        ) : filteredFiles.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-md border border-blue-200">
            <table className="min-w-full divide-y divide-blue-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-green-600 uppercase tracking-wider hidden sm:table-cell">
                    Rows
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-green-600 uppercase tracking-wider hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-green-600 uppercase tracking-wider hidden md:table-cell">
                    Uploaded At
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-green-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-green-100">
                {filteredFiles.map((file) => (
                  <tr key={file._id} className="hover:bg-green-50 transition-colors duration-150 ease-in-out">
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {file.originalname}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                      {file.data.length}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                      {getStatusIcon("uploaded")}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                      {new Date(file.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleView(file._id)}
                          className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
                          title="View File"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeletefile(file._id)}
                          className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400"
                          title="Delete File"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[40vh]">
            <p className="text-center text-gray-500 text-2xl font-medium">
              No Files Found. Upload a file to see its history!
            </p>
          </div>
        )}
      </div>
      {!loading && <Visualize files={filteredFiles} loading={loading} />}
    </div>
  );
};

export default History;