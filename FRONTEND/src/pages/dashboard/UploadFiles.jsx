import { UploadCloud, Trash } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const UploadFiles = () => {
  const {
    newfiles,
    setNewfiles,
    handlebrowse,
    getStatusIcon,
    uploading,
    handleUpload,
    error,
  } = useAuth();

  const handleFileRemove = (index) => {
    setNewfiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen p-6 bg-blue-100 flex flex-col items-center">
      <div className="bg-white w-full max-w-5xl p-6 shadow-md rounded-lg">
        <h1 className="text-3xl font-semibold text-blue-600 mb-5 text-center">
          Upload Excel Files
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Easily upload and manage your Excel files. Drag and drop files, or
          click the button below to browse.
        </p>

        <div className="flex flex-col md:flex-row gap-8 justify-between items-center">
          <div className="border-2 border-dashed border-blue-400 rounded-lg p-6 flex flex-col items-center w-full md:w-1/3 bg-blue-50">
            <UploadCloud size={50} className="text-blue-600" />
            <p className="mt-4 text-gray-700">Drag and Drop your files here</p>
            <input
              type="file"
              multiple
              className="hidden"
              id="file-upload"
              onChange={handlebrowse}
            />
            <label
              htmlFor="file-upload"
              className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700"
            >
              <svg
                fill="#fff"
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 50 50"
              >
                <path d="M28.8125 .03125L.8125 5.34375C.339844 5.433594 0 5.863281 0 6.34375L0 43.65625C0 44.136719 .339844 44.566406 .8125 44.65625L28.8125 49.96875C28.875 49.980469 28.9375 50 29 50C29.230469 50 29.445313 49.929688 29.625 49.78125C29.855469 49.589844 30 49.296875 30 49L30 1C30 .703125 29.855469 .410156 29.625 .21875C29.394531 .0273438 29.105469 -.0234375 28.8125 .03125ZM32 6L32 13L34 13L34 15L32 15L32 20L34 20L34 22L32 22L32 27L34 27L34 29L32 29L32 35L34 35L34 37L32 37L32 44L47 44C48.101563 44 49 43.101563 49 42L49 8C49 6.898438 48.101563 6 47 6ZM36 13L44 13L44 15L36 15ZM6.6875 15.6875L11.8125 15.6875L14.5 21.28125C14.710938 21.722656 14.898438 22.265625 15.0625 22.875L15.09375 22.875C15.199219 22.511719 15.402344 21.941406 15.6875 21.21875L18.65625 15.6875L23.34375 15.6875L17.75 24.9375L23.5 34.375L18.53125 34.375L15.28125 28.28125C15.160156 28.054688 15.035156 27.636719 14.90625 27.03125L14.875 27.03125C14.8125 27.316406 14.664063 27.761719 14.4375 28.34375L11.1875 34.375L6.1875 34.375L12.15625 25.03125ZM36 20L44 20L44 22L36 22ZM36 27L44 27L44 29L36 29ZM36 35L44 35L44 37L36 37Z" />
              </svg>
              Browse Files
            </label>
          </div>
          <div className="w-full md:w-2/3">
            {newfiles.length > 0 ? (
              <ul className="space-y-4">
                                {newfiles.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-blue-50 p-5 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-200" // More padding, subtle shadow and border, hover effect
                  >
                    <div className="flex items-center">
                      {getStatusIcon(file.status)}
                      <div className="ml-4">
                        <p className="font-semibold text-blue-800 text-lg">
                          {file.name}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFileRemove(index)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors duration-200" // Added padding, rounded, hover background
                    >
                      <Trash size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
               <div className="flex flex-col items-center justify-center h-full min-h-[200px] bg-blue-100 p-8 text-center rounded-2xl border-2 border-dashed border-blue-300"> {/* Min height for better empty state, dashed border */}
                
                <p className="text-blue-600 text-2xl font-bold">
                  No files selected yet!
                </p>
                <p className="text-gray-500 mt-2 text-md">
                  Browse or drag files to start uploading.
                </p>
              </div>
            )}
          </div>
        </div>

        {newfiles.length > 0 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`bg-blue-600 text-white px-6 py-2 rounded-md ${
                uploading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {uploading ? "Uploading..." : "Upload Files"}
            </button>
          </div>
        )}

        {error && (
          <p className="mt-4 text-center text-red-500 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
};

export default UploadFiles;



