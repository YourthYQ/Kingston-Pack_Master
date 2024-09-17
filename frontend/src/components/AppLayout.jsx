// src/components/AppLayout.jsx

import React from "react";
import NavigationMenu from "./NavigationMenu";
import PackingOptions from "./PackingOptions";

const AppLayout = ({
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
      {/* Floating Background Box */}
      <div className="floating-image"></div>

      {/* Navigation Menu */}
      <NavigationMenu />

      <div className="body">
        <h1>Optimize Your Packing Process</h1>

        <PackingOptions
          setUseManualInput={setUseManualInput}
          useManualInput={useManualInput}
          handlePalletSelection={handlePalletSelection}
          handleFileUpload={handleFileUpload}
          sendPalletizationRequest={sendPalletizationRequest}
          sendPalletizationManual={sendPalletizationManual}
          solution={solution}
          palletDims={palletDims}
        />
      </div>
    </div>
  );
};

export default AppLayout;