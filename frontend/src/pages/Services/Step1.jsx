import React from "react";
import BoxImage1 from "./images/BoxImage1";
import postman from "./images/postman.png";
import "./styles/Step1.css";

const Step1 = ({ goToStep }) => {
  return (
    <>
      <div className="card1">
        <div className="left">
          <div className="text">
            <h2>Hey! I am your PackMate</h2>
            <p>
              I'm here to <strong>assist you</strong> with our advanced
              algorithms, enabling you to optimize your warehouse's operations
              for <strong>enhanced speed and efficiency</strong>.
            </p>
          </div>

          <BoxImage1 />

          <button onClick={() => goToStep(1)}>Let's start</button>
        </div>

        <div className="right">
          <img alt="Illustration of a worker holding a box" src={postman} />
        </div>
      </div>
    </>
  );
};

export default Step1;
