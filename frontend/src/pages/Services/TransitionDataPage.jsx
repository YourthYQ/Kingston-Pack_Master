import React, { useState, useEffect } from "react";
import "./styles/TransitionDataPage.css";
import GradientButton from "./components/GradientButton";
import ResultsDisplay from "./components/ResultsDisplay";
import BoxImage4 from "./images/BoxImage4";
import axios from "axios";
import { Flex, Spin } from "antd";

const TransitionDataPage = ({
  isManualInput,
  isAir,
  isPlastic,
  uploadedData,
  solution,
  setSolution,
  palletDims,
  setPalletDims,
}) => {
  const [loading, setLoading] = useState(false); // State to track loading status

  useEffect(() => {
    if (isAir) {
      const newDims = isPlastic
        ? { length: 48, width: 40, height: 57 }
        : { length: 48, width: 40, height: 57 };
      setPalletDims(newDims);
    } else {
      const newDims = isPlastic
        ? { length: 48, width: 40, height: 67 }
        : { length: 48, width: 40, height: 67 };
      setPalletDims(newDims);
    }
  }, [isAir, isPlastic]); // Depend on isAir and isPlastic to rerun this effect

  // Function to send the palletization request
  const handlePalletization = async (manual = false) => {
    setLoading(true); // Set loading to true when the request starts
    try {
      const data = manual
        ? { boxes: uploadedData, pallet_dims: palletDims }
        : new FormData();
      if (!manual) {
        data.append("file", uploadedData);
        data.append("pallet_dims", JSON.stringify(palletDims));
      }

      const response = await axios.post(
        "http://127.0.0.1:5000/palletize",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSolution(response.data.best_solutions);
      setPalletDims(response.data.pallet_dims);
    } catch (error) {
      console.error("Error while fetching solution:", error);
    } finally {
      setLoading(false); // Set loading to false when the request completes
    }
  };

  return (
    <>
      {loading ? (
        <div className="card9">
          <Flex align="center" gap="middle">
            <Spin size="large" />
          </Flex>
        </div>
      ) : solution ? (
        <ResultsDisplay solution={solution} palletDims={palletDims} />
      ) : (
        <div className="card7">
          <div className="left">
            <BoxImage4 />
          </div>
          <div className="right">
            <div className="upper">
              <div className="title">
                <h2 className="ubuntu-heading">
                  Discover how we will pack your boxes
                </h2>
                <p className="ubuntu-light">
                  Your cargos will be shipped via{" "}
                  <strong>{isAir ? "Air" : "Sea"}{" "}Transportation</strong>,
                  <br></br>
                  coupled with{" "}
                  <strong>{isPlastic ? "Plastic" : "Wooden"} Pallets</strong>.
                </p>
              </div>
            </div>
            <div className="lower">
              <GradientButton
                onClick={() => handlePalletization(isManualInput)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransitionDataPage;
