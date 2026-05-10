import React, { useState, useMemo, useRef } from "react";
import { Bar, Pie, Line, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useAuth } from "../../context/AuthContext";
import ThreeDChartWrapper from "./ThreeDChartWrapper";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

const generateColors = (n) => {
  const colors = [];
  for (let i = 0; i < n; i++) {
    const hue = (i * (360 / n)) % 360;
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  return colors;
};

export default function ChartVisualise() {
  const {
    filteredFiles,
    excelData,
    columns,
    error,
    loading,
    fetchAndParseFile,
  } = useAuth();

  const [selectedFileId, setSelectedFileId] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");
  const [chartType, setChartType] = useState("bar");
  const chartRef = useRef(null);

  const handleFileChange = async (fileId) => {
    setSelectedFileId(fileId);
    const file = filteredFiles.find((f) => f._id === fileId);
    setSelectedFileName(file ? file.originalname || file.name || "" : "");
    if (fileId) {
      await fetchAndParseFile(fileId, localStorage.getItem("token") || "");
      setXKey("");
      setYKey("");
      setChartType("bar");
    }
  };

  const chartData = useMemo(() => {
    if (!xKey || !yKey || excelData.length === 0 || chartType.startsWith('3d')) return null;

    const labels = excelData.map((item) => String(item[xKey]));
    const yValues = excelData.map((item) => Number(item[yKey]) || 0);

    const commonDatasetOptions = {
      label: yKey,
      data: yValues,
      backgroundColor: generateColors(labels.length),
      borderColor: generateColors(labels.length).map(color => color.replace('70%', '50%').replace('60%', '50%')),
      borderWidth: 1,
    };

    switch (chartType) {
      case "pie":
        return {
          labels,
          datasets: [
            {
              data: yValues,
              backgroundColor: generateColors(labels.length),
              borderColor: generateColors(labels.length).map(color => color.replace('70%', '50%').replace('60%', '50%')),
              borderWidth: 1,
            },
          ],
        };
      case "line":
        return {
          labels,
          datasets: [
            {
              ...commonDatasetOptions,
              fill: false,
              borderColor: "#3B82F6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.1,
              pointBackgroundColor: "#3B82F6",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#3B82F6",
            },
          ],
        };
      case "scatter":{
        const scatterData = excelData.map((item, index) => ({
          x: index,
          y: Number(item[yKey]) || 0,
        
        }));
      
        return {
          datasets: [
            {
              label: yKey,
              data: scatterData,
              backgroundColor: generateColors(scatterData.length),
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        };
      }
      case "bar":
      default:
        return {
          labels,
          datasets: [
            {
              ...commonDatasetOptions,
              backgroundColor: "#3B82F6",
            },
          ],
        };
    }
  }, [xKey, yKey, excelData, chartType]);

  const downloadChart = () => {
    if (chartRef.current && !chartType.startsWith('3d')) {
      const chartImage = chartRef.current.toBase64Image();
      const link = document.createElement("a");
      link.href = chartImage;
      link.download = `${selectedFileName || "chart"}-${chartType}.png`;
      link.click();
    } else if (chartType.startsWith('3d')) {
      // For 3D charts, the download functionality is built into the ThreeDChartWrapper component
      // The download button in the 3D chart will handle the screenshot capture
      showCustomAlert("unable to download 3D chart from here. Please use the download button on the 3D chart itself.");
    }
  };

  const renderChart = () => {
    if (!excelData || excelData.length === 0 || !xKey || !yKey) {
      return (
        <p className="text-center text-gray-500 py-8">
          Please select X-axis, Y-axis, and a file to visualize data.
        </p>
      );
    }

    if (chartType.startsWith('3d')) {
      return (
        <ThreeDChartWrapper
          chartType={chartType}
          excelData={excelData}
          xKey={xKey}
          yKey={yKey}
        />
      );
    }

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart: ${yKey} vs ${xKey}`,
        },
      },
      scales: chartType !== 'pie' ? {
        x: {
          title: {
            display: true,
            text: xKey,
          }
        },
        y: {
          title: {
            display: true,
            text: yKey,
          }
        }
      } : undefined,
    };

    switch (chartType) {
      case "bar":
        return <Bar ref={chartRef} data={chartData} options={chartOptions} />;
      case "pie":
        return (
          <div className="w-[50%] mx-auto">
            <Pie ref={chartRef} data={chartData} />
          </div>
        );
      case "line":
        return <Line ref={chartRef} data={chartData} options={chartOptions} />;
      case "scatter":
        return <Scatter ref={chartRef} data={chartData} options={chartOptions} />;
      default:
        return null;
    }
  };

  const showCustomAlert = (message) => {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    alertDiv.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm text-center">
        <p class="text-lg font-semibold mb-4">${message}</p>
        <button id="close-alert" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          OK
        </button>
      </div>
    `;
    document.body.appendChild(alertDiv);

    const closeButton = document.getElementById('close-alert');
    if (closeButton) {
      closeButton.onclick = () => {
        document.body.removeChild(alertDiv);
      };
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-6xl mx-auto my-10 p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text">
          Chart Visualization
        </h2>

        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500 text-xl">No uploaded files available</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* File Selection */}
              <div>
                <label htmlFor="file-select" className="block mb-2 text-gray-700 font-semibold">
                  Select File:
                </label>
                <select
                  id="file-select"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                  value={selectedFileId}
                  onChange={(e) => handleFileChange(e.target.value)}
                >
                  <option value="">-- Select a file --</option>
                  {filteredFiles.map((file) => (
                    <option key={file._id} value={file._id}>
                      {file.originalname || file.name || "Unnamed file"}
                    </option>
                  ))}
                </select>
              </div>

              {/* X-axis Selection */}
              {columns.length > 0 && (
                <div>
                  <label htmlFor="xkey" className="block mb-2 text-gray-700 font-semibold">
                    X-axis:
                  </label>
                  <select
                    id="xkey"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                    value={xKey}
                    onChange={(e) => setXKey(e.target.value)}
                  >
                    <option value="">-- Select X-axis --</option>
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Y-axis Selection */}
              {columns.length > 0 && (
                <div>
                  <label htmlFor="ykey" className="block mb-2 text-gray-700 font-semibold">
                    Y-axis:
                  </label>
                  <select
                    id="ykey"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                    value={yKey}
                    onChange={(e) => setYKey(e.target.value)}
                  >
                    <option value="">-- Select Y-axis --</option>
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Chart Type Selection */}
              {columns.length > 0 && (
                <div>
                  <label htmlFor="charttype" className="block mb-2 text-gray-700 font-semibold">
                    Chart Type:
                  </label>
                  <select
                    id="charttype"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                  >
                    <optgroup label="2D Charts">
                      <option value="bar">Bar Chart</option>
                      <option value="pie">Pie Chart</option>
                      <option value="line">Line Chart</option>
                      <option value="scatter">Scatter Chart</option>
                    </optgroup>
                    <optgroup label="3D Charts">
                      <option value="3dColumn">3D Column Chart</option>
                      <option value="3dPie">3D Pie Chart</option>
                      <option value="3dLine">3D Line Chart</option>
                      <option value="3dScatter">3D Scatter Chart</option>
                    </optgroup>
                  </select>
                </div>
              )}
            </div>

            {/* Loading and Error Messages */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
                <p className="text-blue-600 font-semibold">Loading and parsing file data...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 font-semibold">{error}</p>
              </div>
            )}

            {/* Download Button */}
            {columns.length > 0 && xKey && yKey && !loading && (
              <div className="mb-6 text-center">
                <button
                  onClick={downloadChart}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  📥 Download Chart
                </button>
              </div>
            )}

            {/* Chart Rendering Area */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
              {renderChart()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}