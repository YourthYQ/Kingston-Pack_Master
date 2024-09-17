import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css"; // Specific styles for landing page
import BoxImage from "./BoxImage";
import "bootstrap/dist/css/bootstrap.min.css";

const LandingPage = () => {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="left">
                <div className="top">
                  <h1 className="montserrat-heading">
                    Mastering 3D Bin <br></br> Packing
                  </h1>
                </div>
                <div className="bottom">
                  <Link className="btn montserrat-light" to="/services">
                    TRY IT NOW →
                  </Link>
                  <p>
                    Optimize your space and boost productivity with our expert
                    3D bin packing solutions.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <BoxImage />
              {/* Correct way to use the image */}
            </div>
          </div>
        </div>
      </section>

      <section className="hero_bottom">
        <div className="merits">
          <div>
            <div>
              <h1 className="suse-heading">01</h1>
            </div>
            <div className="line"></div>
            <div className="parag">
              <h3 className="montserrat-heading">Space Optimization</h3>
              <p className="montserrat-light">
                Maximize your storage efficiency.
              </p>
            </div>
          </div>

          <div>
            <div>
              <h1 className="suse-heading">02</h1>
            </div>
            <div className="line"></div>
            <div className="parag">
              <h3 className="montserrat-heading">Productivity Boost</h3>
              <p className="montserrat-light">
                Streamline your packing processes.
              </p>
            </div>
          </div>

          <div>
            <div>
              <h1 className="suse-heading">03</h1>
            </div>
            <div className="line"></div>
            <div className="parag">
              <h3 className="montserrat-heading">Space Optimization</h3>
              <p className="montserrat-light">
                Save on storage and transportation cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="why">
        <div className="container">
          <h1>Why Choose 3D Pack Masters?</h1>
          <p>Revolutionize your packing with our cutting-edge solutions.</p>

          <div className="features">
            <div className="feature">
              <div className="icon">
                <i className="fas fa-cogs"></i>
              </div>
              <h3>Advanced Algorithms</h3>
              <p>Our algorithms ensure optimal space utilization.</p>
            </div>

            <div className="feature">
              <div className="icon">
                <i className="fas fa-puzzle-piece"></i>
              </div>
              <h3>Custom Solutions</h3>
              <p>Tailored 3D packing solutions to meet your specific needs.</p>
            </div>

            <div className="feature">
              <div className="icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>Expert Support</h3>
              <p>Our team provides unparalleled support and guidance.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="foot">
        <div className="footer">
          <div className="nav">
            <a href="#">Home</a>
            <a href="#">Services</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </div>
          <div className="divider"></div>
          <div className="bottom">
            <div className="social-icons">
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <div className="copyright">
              © 3D Pack Masters 2024, All Rights Reserved
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
