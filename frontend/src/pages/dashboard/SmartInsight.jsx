import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const SmartInsights = () => {
  const { user } = useAuth();
  const token = user?.token;

  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState("");
  const [insight, setInsight] = useState("");
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("You must be logged in to see files.");
      return;
    }

    const fetchFiles = async () => {
      setLoadingFiles(true);
      try {
        const res = await axios.get("http://localhost:5000/api/files", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFiles(res.data.files || []);
      } catch (err) {
        setError("Unable to load uploaded files.", err);
      } finally {
        setLoadingFiles(false);
      }
    };

    fetchFiles();
  }, [token]);

  const generateInsight = async () => {
    if (!selectedFileId) {
      setError("Please select a file.");
      return;
    }
    setError("");
    setInsight("");
    setLoadingInsight(true);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/insights/files/${selectedFileId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInsight(res.data.insight);
    } catch (error) {
      if (error.response) {
        setError(`Failed to generate insight. Status: ${error.response.status}`);
      } else if (error.request) {
        setError("No response from server.");
      } else {
        setError("Error generating insight.");
      }
    } finally {
      setLoadingInsight(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-blue-100">
      <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-blue-800 mb-8">
          Smart Insights
        </h2>

        {loadingFiles ? (
          <p className="text-center text-gray-500 text-2xl">
            Loading your files...
          </p>
        ) : (
          <>
            {files.length === 0 ? (
              <p className="text-center text-gray-500 text-2xl">
                No Uploaded files Available!!!
              </p>
            ) : (
              <>
                <label
                  htmlFor="file-select"
                  className="block mb-2 text-gray-700 font-semibold"
                >
                  Choose an uploaded file:
                </label>
                <select
                  id="file-select"
                  value={selectedFileId}
                  onChange={(e) => setSelectedFileId(e.target.value)}
                  className="w-full mb-6 px-3 py-2 border border-blue-300 rounded-lg"
                >
                  <option value="">-- Select a file --</option>
                  {files.map(({ _id, originalname }) => (
                    <option key={_id} value={_id}>
                      {originalname}
                    </option>
                  ))}
                </select>

                <button
                  onClick={generateInsight}
                  disabled={loadingInsight || !selectedFileId}
                  className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loadingInsight ? "Generating Insight..." : "Get Insight"}
                </button>

                {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

                {insight && (
                  <section className="mt-6 p-4 bg-gray-50 rounded border border-gray-300">
                    <h3 className="font-semibold mb-2">Insight Summary</h3>
                    <p>{insight}</p>
                  </section>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SmartInsights;
