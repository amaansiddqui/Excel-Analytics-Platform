import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../../context/AuthContext";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Visualize = () => {
  const { files, loading } = useAuth();
  console.log("Received files in Visualize:", files);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-white p-6 rounded-xl shadow-lg max-w-6xl mx-auto mt-8">
        <p className="text-center text-gray-600 text-xl font-medium animate-pulse">
          Loading visualization data...
        </p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-white p-6 rounded-xl shadow-lg max-w-6xl mx-auto mt-8">
        <p className="text-center text-gray-500 text-xl font-medium">
          No file data available for visualization. Upload some files!
        </p>
      </div>
    );
  }
  
  const data = {
    labels: files.map((file) => file.originalname || "Unknown File"),
    datasets: [
      {
        label: "Number of Rows",
        data: files.map((file) => (file.data ? file.data.length : 0)), 
        backgroundColor: [
          "rgba(75, 192, 192, 0.8)", // Teal
          "rgba(153, 102, 255, 0.8)", // Purple
          "rgba(255, 159, 64, 0.8)", // Orange
          "rgba(255, 99, 132, 0.8)", // Red
          "rgba(54, 162, 235, 0.8)", // Blue
          "rgba(255, 206, 86, 0.8)", // Yellow
          "rgba(75, 192, 192, 0.8)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1.5,
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "File Names",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Rows",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg max-w-6xl mx-auto mt-8 transition-all duration-300 ease-in-out">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-700 mb-6 text-center">
        File Data Visualization
      </h2>
      <div className="relative h-64 sm:h-80 md:h-96">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Visualize;