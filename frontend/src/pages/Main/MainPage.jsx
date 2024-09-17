import React, { useState } from "react";
import AppLayout from "../../components/AppLayout"; // Import the AppLayout component for the page layout
import axios from "axios";

const MainPage = () => {
  const [solution, setSolution] = useState(null);
  const [palletDims, setPalletDims] = useState([0, 0, 0]);
  const [uploadedData, setUploadedData] = useState(null);
  const [useManualInput, setUseManualInput] = useState(false);

  // Function to send the palletization request for file upload
  const sendPalletizationRequest = async () => {
    if (!palletDims || !uploadedData) {
      alert("Please upload a file and select a pallet type!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", uploadedData);
      formData.append("pallet_dims", JSON.stringify(palletDims));

      const response = await axios.post(
        "http://127.0.0.1:5000/palletize",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSolution(response.data.best_solutions);
      
      setPalletDims(response.data.pallet_dims);
    } catch (error) {
      console.error("Error while fetching solution:", error);
    }
  };

  // Function to send the palletization request for manual box input
  const sendPalletizationManual = async (boxes, manualPalletDims) => {
    if (!manualPalletDims || !boxes) {
      alert("Please fill in all boxes and pallet dimensions!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/palletize", {
        boxes,
        pallet_dims: manualPalletDims,
      });

      setPalletDims(response.data.pallet_dims);
      setSolution(response.data.best_solutions);
    } catch (error) {
      console.error("Error while fetching solution:", error);
    }
  };

  // Function to handle file upload
  const handleFileUpload = (file) => {
    setUploadedData(file);
  };

  const handlePalletSelection = (type) => {
    if (type === "plastic") {
      setPalletDims({ length: 45, width: 40, height: 62 });
    } else if (type === "wood") {
      setPalletDims({ length: 48, width: 40, height: 66 });
    }
  };

  return (
    <AppLayout
      setUseManualInput={setUseManualInput}
      useManualInput={useManualInput}
      handlePalletSelection={handlePalletSelection}
      handleFileUpload={handleFileUpload}
      sendPalletizationRequest={sendPalletizationRequest}
      sendPalletizationManual={sendPalletizationManual}
      solution={solution}
      palletDims={palletDims}
    />
  );
};

export default MainPage;