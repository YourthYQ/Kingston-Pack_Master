import React from "react";
import BoxImage5 from "./images/BoxImage5";
import FileUpload from "./components/FileUpload";
import "./styles/UploadFilePage.css";

const UploadFilePage = ({ goToStep, uploadedData, setUploadedData }) => {

  // Function to send the palletization request for file upload
  const checkValidFileUpload = async () => {
    if (!uploadedData) {
      alert("Please upload a file!");
      return;
    }

    // Send the data to MainPage (can be done via AppLayout)
    setUploadedData(uploadedData);
    goToStep(6); // Assuming this will redirect to MainPage or a new page where AppLayout is used
  };

  // Function to handle file upload
  const handleFileUpload = (file) => {
    setUploadedData(file);
  };

  return (
    <>
      <div className="card6">
        <div className="left">
          <div className="text">
            <h2>
              Final step! <br></br> Upload your dimension file here!
            </h2>
            <p>
              I'm here to <strong>assist you</strong> with our advanced
              algorithms, enabling you to optimize your warehouse's operations
              for <strong>enhanced speed and efficiency</strong>.
            </p>
          </div>

          <FileUpload onFileUpload={handleFileUpload} />

          <button onClick={checkValidFileUpload}>Submit File</button>
        </div>

        <div className="right">
          <BoxImage5 />
        </div>
      </div>
    </>
  );
};

export default UploadFilePage;