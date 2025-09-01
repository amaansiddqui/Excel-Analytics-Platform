
import React, { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { Link } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext";
import {
  Activity,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  MoreVertical,
  RefreshCw,
  Upload,
  XCircle,
  UploadCloud, 
  ChartPie, 
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const Dashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const {
    summary,
    recentUploads,
    chartData,
    uploadTrendData, 
    user,
    loading,
    fetchDashboardData,
  } = useAuth();

  // State for the Line Chart data
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Successful Uploads",
        data: [],
        borderColor: "rgb(16, 185, 129)", 
        backgroundColor: "rgba(16, 185, 129, 0.1)", 
        tension: 0.4, 
        fill: true,
      },
      {
        label: "Failed Uploads",
        data: [],
        borderColor: "rgb(239, 68, 68)", 
        backgroundColor: "rgba(239, 68, 68, 0.1)", 
        tension: 0.4,
        fill: true,
      },
    ],
  });

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "Inter",
          },
          color: "#374151", 
        },
      },
      title: {
        display: true,
        text: "Upload Trends Over Time", 
        font: {
          size: 16,
          family: "Inter",
        },
        color: "#1F2937", 
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280", 
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#E5E7EB", 
        },
        ticks: {
          color: "#6B7280", 
        },
      },
    },
  };

  const doughnutChartdata = chartData
    ? {
        labels: chartData.labels, 
        datasets: [
          {
            data: chartData.data, 
            backgroundColor: ["#10B981", "#EF4444"], 
            borderColor: ["#FFFFFF", "#FFFFFF"], 
            borderWidth: 2,
          },
        ],
      }
    : null;

  
  const doughnutChartOption = {
    responsive: true, 
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: "bottom", 
        labels: {
          font: {
            size: '14',
            family: "Inter", // Use Inter font
          },
          color: "#374151", // text-gray-700
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label +=
                new Intl.NumberFormat("en-US").format(context.parsed) +
                " files";
            }
            return label;
          },
        },
      },
    },
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

 useEffect(() => {
  if (
    uploadTrendData &&
    Array.isArray(uploadTrendData.labels) &&
    uploadTrendData.labels.length > 0 &&
    Array.isArray(uploadTrendData.successfulUploads) &&
    Array.isArray(uploadTrendData.failedUploads)
  ) {
    setLineChartData((prevData) => ({
      ...prevData,
      labels: uploadTrendData.labels,
      datasets: [
        {
          ...prevData.datasets[0],
          data: uploadTrendData.successfulUploads,
        },
        {
          ...prevData.datasets[1],
          data: uploadTrendData.failedUploads,
        },
      ],
    }));
  }
}, [uploadTrendData]);



  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData(); 
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="flex w-full">
      <div className="p-6 flex-1 bg-blue-50 h-screen">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className=" lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name || "User"}! 👋
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your data analytics today.
              </p>
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
        {loading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)] bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-center text-gray-600 text-xl font-medium">
              Loading Dashboard Data...
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                {
                  title: "Total Files Uploaded",
                  value: summary.totalFiles,
                  color: "blue",
                },
                {
                  title: "Successful Uploads",
                  value: summary.successfulUploads,
                  color: "green",
                },
                {
                  title: "Failed Uploads",
                  value: summary.failedUploads,
                  color: "red",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`bg-${item.color}-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`}
                >
                  <p className="text-2xl font-bold text-${item.color}-600">
                    {item.value}
                  </p>
                  <p className="text-sm text-gray-600">{item.title}</p>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

              {/* Upload Trends (Line Chart) */}
              <div className="lg:col-span-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Activity size={24} className="text-blue-600" />
                    Upload Trends
                  </h3>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="relative h-80">
                 
                  {lineChartData.labels.length > 0 ? (
                    <Line data={lineChartData} options={lineChartOptions} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>No trend data available</p>
                    </div>
                  )}
                </div>
              </div>
              {/* Upload Status (Doughnut Chart) */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <ChartPie size={24} className="text-blue-600" />
                    Upload Status Overview
                  </h3>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="relative h-64">
                  {doughnutChartdata ? (
                    <Doughnut
                      data={doughnutChartdata}
                      options={doughnutChartOption}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>No data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Uploads Table */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Recent Uploads
                </h3>
                <Link
                  to="/file-history"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  View all
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          File Name
                        </div>
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date
                        </div>
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Status
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUploads && recentUploads.length > 0 ? (
                      recentUploads.map((upload, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <FileText className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="font-medium text-gray-900">
                                {upload.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              {upload.date}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                                upload.status === "uploaded"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {upload.status === "uploaded" ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                              {upload.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-12 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="bg-gray-100 p-4 rounded-full">
                              <Upload className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-gray-500 font-medium">
                                No uploads yet
                              </p>
                              <p className="text-gray-400 text-sm">
                                Start by uploading your first file
                              </p>
                            </div>
                            <Link
                              to="/upload-files"
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                            >
                              <Upload className="w-4 h-4" />
                              Upload Files
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
