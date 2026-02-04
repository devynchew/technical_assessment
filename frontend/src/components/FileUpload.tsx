import { useState } from "react";
import axios from "axios";

export const FileUpload = ({
  onUploadSuccess,
}: {
  onUploadSuccess: () => void;
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setError(null); // Clear previous errors when selecting a new file
    setProgress(0);

    try {
      await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total!,
          );
          setProgress(percent);
        },
      });
      // On success
      setUploading(false);
      onUploadSuccess(); // Trigger data refresh
      e.target.value = "";
    } catch (err: any) {
      setUploading(false);

      // Check backend for error message
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Upload failed. Please check your connection.");
      }
    }
  };

  return (
    <div className="p-4 border rounded">
      <div>
        <input
          data-testid="file-upload-input"
          type="file"
          accept=".csv"
          onChange={handleUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      {/* Progress bar when uploading */}
      {uploading && (
        <div className="w-full mt-2">
          {/* Label and percentage text */}
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-blue-700">Uploading...</span>
            <span className="text-xs font-medium text-blue-700">{progress}%</span>
          </div>
          
          {/* Visual Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}
    </div>
  );
};
