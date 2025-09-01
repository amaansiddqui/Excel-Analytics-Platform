import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { CheckCircle, FileText, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const AuthContext = createContext();

const API_BASE_URL = "http://localhost:5000";
export const AuthProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newfiles, setNewfiles] = useState([]);
  const [summary, setSummary] = useState({});
  const [recentUploads, setRecentUploads] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [uploadTrendData, setUploadTrendData] = useState(null);
  const [user, setUser] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [users, setUsers] = useState([]);
  // const [insights, setInsights] = useState([]);

  // Helper to get auth headers
  const authHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Fetch file history on mount
  const fetchFileHistory = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/files/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
      setFilteredFiles(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchFileHistory();
    }
  }, [fetchFileHistory]);

  // Sync newfiles with files state
  useEffect(() => {
    setFiles(newfiles);
  }, [newfiles]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [summaryRes, recentUploadsRes, chartDataRes, uploadTrendsRes] =
        await Promise.all([
          axios.get(`${API_BASE_URL}/api/dashboard/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/dashboard/recent-uploads`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/dashboard/chart-data`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/dashboard/upload-trends`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      setSummary(summaryRes.data);
      setRecentUploads(recentUploadsRes.data);
      setChartData(chartDataRes.data);
      setUploadTrendData(uploadTrendsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const registerUser = async (data, reset, navigate) => {
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        data
      );

      setMessage(response.data.msg || "User registered successfully.");
      reset();

      // Navigate to login after 1.5s
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.msg || "Something went wrong. Please try again."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logout successful");
  };

  const loginUser = async (data, navigate) => {
    setMessage("");
    setError("");
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, data);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify({ ...user, token })); // store with token

      setUser({ ...user, token }); // <-- important
       toast.success("Login successful", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
      if (user.role === "admin") {
       
        navigate("/admin");
      } else {
        
         setTimeout(() => {
           navigate("/dashboard");
         }, 2000); 
      }
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          "Invalid email or password. Please try again."
      );
    }
  };

  // forgot password
  const forgotPassword = async (email) => {
    try {
      setError("");
      setMessage("");
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
      setMessage("Reset password link sent to your email.");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Failed to send reset link. Try again later.";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  const resetPassword = async (token, newPassword) => {
    console.log("resetPassword function called with", { token, newPassword });
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/reset-password/${token}`,
        { password: newPassword }
      );
      setError(null); // clear error on success
      setMessage(
        response.data.message || "Password reset successful! Redirecting..."
      );
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Password reset failed. Please try again."
      );
      setMessage(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      toast.error("Error fetching user data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user settings
  const updateUser = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_BASE_URL}/api/user`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("User updated successfully");
      // Update user state if needed:
      if (response.data) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Failed to update user. Try again."
      );
    }
  };

  // const onSubmit = async (formData) => {
  //   const { password } = formData;

  //   if (!password) {
  //     toast.error("Please enter a new password.");
  //     return;
  //   }

  //   await updateUser({ password });
  // };

  // Delete user account
  const deleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );

    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");

        await axios.delete(`${API_BASE_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Account deleted successfully!");
        setUser(null);
        localStorage.clear(); // Clear all stored data
        window.location.href = "/login"; // Redirect to login page
      } catch (error) {
        toast.error("Failed to delete account.", error);
      }
    }
  };

  // Search handler
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredFiles(
      files.filter((file) => file.originalname.toLowerCase().includes(query))
    );
  };

  // Browse handler for new file selection (if needed)
  const handlebrowse = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const updatedFiles = selectedFiles.map((file) => ({
      file,
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      status: "pending",
    }));

    setNewfiles((prevNewFiles) => {
      const existingNames = prevNewFiles.map((f) => f.name);
      const filteredNewFiles = updatedFiles.filter(
        (file) => !existingNames.includes(file.name)
      );
      return [...prevNewFiles, ...filteredNewFiles];
    });

    setFiles((prevFiles) => {
      const existingNames = prevFiles.map((f) => f.name);
      const filteredNewFiles = updatedFiles.filter(
        (file) => !existingNames.includes(file.name)
      );
      return [...prevFiles, ...filteredNewFiles];
    });

    setError("");
  };

  // Upload handler
  const handleUpload = async () => {
    setUploading(true);
    const updatedFiles = [...files];

    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i].status === "pending") {
        const formData = new FormData();
        formData.append("file", updatedFiles[i].file);

        try {
          const token = localStorage.getItem("token");

          const response = await axios.post(
            `${API_BASE_URL}/api/files/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          updatedFiles[i].status = "uploaded";
          updatedFiles[i].response = response.data;
        } catch (err) {
          console.error(err);
          updatedFiles[i].status = "error";
          updatedFiles[i].response = null;
          setError("Failed to upload one or more files.");
        }
      }
    }

    setFiles(updatedFiles);
    setUploading(false);
  };

  // View file handler
  const handleView = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/files/view/${id}`, {
        headers: authHeader(),
      });
      // Open file view in new tab
      const newWindow = window.open();
      newWindow.document.write(res.data);
      newWindow.document.close();
    } catch (error) {
      console.error("Error viewing file:", error);
    }
  };

  // Download file handler
  const handleDownload = async (fileId, originalName) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/files/download/${fileId}`,
        {
          responseType: "blob", // VERY IMPORTANT
        }
      );

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", originalName); // Excel name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  // Delete file handler
  const handleDeletefile = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/files/delete/${id}`, {
        headers: authHeader(),
      });
      setFiles((prevFiles) => prevFiles.filter((file) => file._id !== id));
      setFilteredFiles((prevFiles) =>
        prevFiles.filter((file) => file._id !== id)
      );
      toast.success("file deleted successfully!!");
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  // Status icon helper
  const getStatusIcon = (status) => {
    switch (status) {
      case "uploaded":
        return <CheckCircle className="text-green-500" />;
      case "pending":
        return <FileText className="text-yellow-500" />;
      case "error":
        return <XCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  // chartvisualise
  const fetchAndParseFile = async (fileId, token) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/files/download/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const wb = XLSX.read(data, { type: "array" });
      const wsName = wb.SheetNames[0];
      const ws = wb.Sheets[wsName];
      const jsonData = XLSX.utils.sheet_to_json(ws, { defval: "" });

      if (!jsonData.length) {
        throw new Error("Selected Excel sheet is empty.");
      }

      setExcelData(jsonData);
      setColumns(Object.keys(jsonData[0]));
    } catch (error) {
      console.error(error);
      setError(error.message || "Error processing the Excel file.");
      setExcelData([]);
      setColumns([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete user by admin handler
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      toast.error("Failed to delete user");
      console.error(err);
    }
  };
  // Delete file by admin handler
  const handleDeleteFilebyAdmin = async (userId, fileId) => {
    console.log("Delete button clicked for file", fileId);
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    console.log("Confirmed deletion");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_BASE_URL}/api/admin/users/${userId}/delete/${fileId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("File deleted successfully");
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? { ...u, files: u.files.filter((file) => file._id !== fileId) }
            : u
        )
      );
    } catch (err) {
      toast.error("Failed to delete file");
      console.error(err);
    }
  };

  //  all users data
  const fetchAllUsers = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      console.log("Response from /api/admin/users:", res.data);
      setUsers(res.data.users); // ✅ CORRECT: Extract 'users' array from the object
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
      setError("Failed to fetch users");
    }
  }, [user?.token]);

  const value = {
    files,
    newfiles,
    setNewfiles,
    filteredFiles,
    uploading,
    loading,
    error,
    message,
    summary,
    recentUploads,
    chartData,
    uploadTrendData,
    user,
    setUser,
    registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    deleteAccount,
    updateUser,
    fetchUserData,
    handleSearch,
    handlebrowse,
    handleUpload,
    handleView,
    handleDownload,
    handleDeletefile,
    getStatusIcon,
    fetchDashboardData,
    fetchAndParseFile,
    excelData,
    columns,
    handleDeleteFilebyAdmin,
    handleDeleteUser,
    fetchAllUsers,
    users,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
