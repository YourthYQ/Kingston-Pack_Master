import React from "react";
import "./styles/Step4.css";
import air from "./images/air.png";
import sea from "./images/sea.png";
import "bootstrap/dist/css/bootstrap.min.css";

const Step4 = ({ goToStep, setIsAir }) => {
  return (
    <>
      <div className="card4">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="title">
                <h2 className="ubuntu-heading">
                  Choose the best way to get your goods where they need to go!
                </h2>
                <p className="ubuntu-light">
                  Fast, or cost-effective - your choice!
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="option" onClick={() => { goToStep(4); setIsAir(true); } }>
                <div className="text">
                  <h3 className="ubuntu-regular">I choose Air Freight</h3>
                  <p className="ubuntu-regular">
                    Fast delivery through the skies—perfect for urgent
                    shipments!
                  </p>
                </div>
                <div className="img">
                  <img src={air}></img>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="option" onClick={() => goToStep(4)}>
                <div className="text">
                  <h3 className="ubuntu-regular">I choose Sea Freight</h3>
                  <p className="ubuntu-regular">
                    Set sail for savings—ideal for larger, less time-sensitive
                    cargo!
                  </p>
                </div>
                <div className="img">
                  <img src={sea}></img>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step4;
