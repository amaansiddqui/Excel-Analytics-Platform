import React from "react";
import styled from "styled-components";

const UploadBtn = () => {
  const token = localStorage.getItem("token"); // assuming token is stored here

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // name must match backend

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        console.log("Upload success:", result);
        alert("File uploaded successfully!");
      } else {
        console.error("Upload failed:", result);
        alert("Upload failed: " + result.error);
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Upload error: " + err.message);
    }
  };

  return (
    <StyledWrapper>
      <div>
        <button className="container-btn-file">
          <svg
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 50 50"
          >
            <path d="..." />
          </svg>
          Upload File
        </button>
        <input
          className="file"
          name="file"
          type="file"
          onChange={handleFileChange}
        />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container-btn-file {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    background-color: #307750;
    color: #fff;
    border-style: none;
    padding: 1em 2em;
    border-radius: 0.5em;
    overflow: hidden;
    z-index: 1;
    box-shadow: 4px 8px 10px -3px rgba(0, 0, 0, 0.356);
    transition: all 250ms;
  }

  .container-btn-file input[type="file"] {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .container-btn-file > svg {
    margin-right: 1em;
  }

  .container-btn-file::before {
    content: "";
    position: absolute;
    height: 100%;
    width: 0;
    border-radius: 0.5em;
    background-color: #469b61;
    z-index: -1;
    transition: all 350ms;
  }

  .container-btn-file:hover::before {
    width: 100%;
  }
`;

export default UploadBtn;
