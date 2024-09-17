// src/components/PackingOptions.jsx

import React, { useState } from "react";
import FileUpload from "./FileUpload";
import BoxForm from "./BoxForm";
import GradientButton from "./GradientButton";
import ResultsDisplay from "./ResultsDisplay";

const PackingOptions = ({
  setUseManualInput,
  useManualInput,
  handlePalletSelection,
  handleFileUpload,
  sendPalletizationRequest,
  sendPalletizationManual,
  solution,
  palletDims,
}) => {
  return (
    <div>
      <h2>Choose Input Mode</h2>
      <div className="button_div">
        <button onClick={() => setUseManualInput(false)}>Upload File</button>
        <button onClick={() => setUseManualInput(true)}>Enter Boxes Manually</button>
      </div>

      {!useManualInput ? (
        <>
          <h2>Select Pallet Dimension</h2>
          <div className="button_div">
            <button onClick={() => handlePalletSelection("plastic")}>
              Plastic Pallet (45 x 40 x 62)
            </button>
            <button onClick={() => handlePalletSelection("wood")}>
              Wood Pallet (48 x 40 x 66)
            </button>
          </div>

          <FileUpload onFileUpload={handleFileUpload} />

          <div>
            <GradientButton onClick={sendPalletizationRequest} />
          </div>
        </>
      ) : (
        <BoxForm onPalletize={sendPalletizationManual} />
      )}

      {solution && (
        <ResultsDisplay solution={solution} palletDims={palletDims} />
      )}
    </div>
  );
};

export default PackingOptions;