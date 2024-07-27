import React, { useState } from "react";
import { toast } from "react-toastify";
import styles from "./ProgressPhotoUpload.module.css";

interface ProgressPhotoUploadProps {
  onPhotoUploaded: () => void;
}

const ProgressPhotoUpload: React.FC<ProgressPhotoUploadProps> = ({
  onPhotoUploaded,
}) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    try {
      // Get the upload URL
      const urlResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/progress-photos/upload-url`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { url, filename } = await urlResponse.json();

      // Upload the file to S3
      await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      // Save the photo details
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/progress-photos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ filename }),
      });

      setFile(null);
      onPhotoUploaded();
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload photo. Please try again.");
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <input type="file" name="image" onChange={handleFileChange} accept="image/*" />
      <button onClick={handleUpload} disabled={!file}>
        Upload Photo
      </button>
    </div>
  );
};

export default ProgressPhotoUpload;
