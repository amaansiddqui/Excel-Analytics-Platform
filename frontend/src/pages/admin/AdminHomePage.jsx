import { useEffect, useState } from "react";
import { Trash2, User, FileText, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Pie } from "react-chartjs-2";
import Modal from "react-modal";

Modal.setAppElement("#root");

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
  },
  content: {
    maxWidth: "600px",
    width: "90%",
    margin: "auto",
    padding: "20px 30px",
    borderRadius: "12px",
    inset: "50% auto auto 50%",
    transform: "translate(-50%, -50%)",
    background: "#f0fdf4",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
    maxHeight: "80vh",
    overflowY: "auto",
  },
};

export default function AdminHomePage() {
  const {
    user,
    fetchAllUsers,
    users,
    loading,
    error,
    handleDeleteUser,
    handleDeleteFilebyAdmin,
  } = useAuth();

  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    if (user?.role === "admin" && user?.token) {
      fetchAllUsers();
    }
  }, [user?.role, user?.token, fetchAllUsers]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleRemoveUser = async (userId) => {
    try {
      await handleDeleteUser(userId);
      console.log("User deleted successfully");
    } catch {
      console.log("failed");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Access denied. Admins only.
      </div>
    );
  }

  const chartData = {
    labels: users?.map((u) => u.name || "Unnamed User") || [],
    datasets: [
      {
        label: "Files Uploaded",
        data: users?.map((u) => u.files?.length || 0) || [],
        backgroundColor: users
          ? users.map((_, index) => `hsl(${(index * 60) % 360}, 70%, 50%)`)
          : [],
      },
    ],
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllUsers();
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="flex w-full">
      <div className="p-6 flex-1 bg-blue-50 h-screen">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className=" lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, Admin! 👋
              </h1>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
        {loading && (
          <div className="text-center text-blue-600 font-medium">
            Loading...
          </div>
        )}
        {error && (
          <div className="text-center text-red-600 font-semibold">{error}</div>
        )}
        {Array.isArray(users) && users.length === 0 && !loading && (
          <div className="text-center text-blue-700 font-semibold">
            No users found.
          </div>
        )}

        {/* Container for side-by-side layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Table takes flex-grow to fill remaining space */}
          <div className="flex-grow overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden border border-blue-300">
              <thead className="bg-blue-200">
                <tr>
                  <th className="text-left p-5 font-semibold uppercase tracking-wider text-blue-900 select-none cursor-default">
                    User Info
                  </th>
                  <th className="p-5 font-semibold uppercase tracking-wider text-blue-900 select-none cursor-default text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(users) &&
                  users.map((u, i) => (
                    <tr
                      key={u._id}
                      className={`border-b border-blue-300 transition-colors ${
                        i % 2 === 0 ? "bg-blue-50" : "bg-white"
                      } hover:bg-blue-100 hover:shadow-md cursor-pointer`}
                    >
                      <td
                        className="p-5 align-top"
                        onClick={() => handleUserClick(u)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleUserClick(u);
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <User className="text-blue-600" size={24} />
                          <div>
                            <div className="font-semibold text-blue-900 text-lg">
                              {u.name || "Unnamed User"}
                            </div>
                            <div className="text-sm text-blue-700">
                              {u.email}
                            </div>
                            <div className="text-xs text-blue-600 font-medium mt-1">
                              Total files: {u.files?.length || 0}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 align-top text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveUser(u._id);
                          }}
                          className="text-red-600 hover:text-red-800 focus:outline-none transition-colors"
                          title="Delete user"
                          aria-label={`Delete user ${u.name || "unnamed"}`}
                        >
                          <Trash2 size={24} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pie chart container with fixed width */}
          <div className="bg-white rounded shadow p-4 max-w-sm w-full shrink-0">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4 text-center">
              User Uploads Pie Chart
            </h2>
            <Pie data={chartData} />
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!selectedUser}
        onRequestClose={handleCloseModal}
        style={modalStyles}
        contentLabel="File Details Modal"
      >
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">
          Files for {selectedUser?.name || "Unnamed User"}
        </h2>
        {selectedUser?.files && selectedUser.files.length > 0 ? (
          <ul className="space-y-2 max-h-[60vh] overflow-auto">
            {selectedUser.files.map((file) => (
              <li
                key={file._id}
                className="flex items-center justify-between bg-blue-100 rounded px-3 py-2"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="text-blue-700" size={16} />
                  <span
                    className="text-blue-800 truncate max-w-xs"
                    title={file.originalname || "Unnamed file"}
                  >
                    {file.originalname || "Unnamed file"}
                  </span>
                </div>
                <button
                  onClick={() =>
                    handleDeleteFilebyAdmin(selectedUser._id, file._id)
                  }
                  className="text-red-600 hover:text-red-800 focus:outline-none"
                  title="Delete file"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-blue-600 italic">No files uploaded</div>
        )}
        <button
          onClick={handleCloseModal}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
        >
          Close
        </button>
      </Modal>
    </div>
  );
}
