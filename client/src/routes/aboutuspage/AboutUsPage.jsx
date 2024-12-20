import { useContext } from "react";
import "./AboutUsPage.scss"

import { AuthContext } from "../../context/AuthContext";

function AboutUsPage() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="aboutUs">   
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">About Our Real Estate Company</h1>
          <p>
            With over 16 years of experience in the real estate industry, we have been dedicated
            to helping our clients find their perfect homes. Our team of experts is committed to
            providing top-notch services, ensuring that every transaction is smooth and successful.
            We pride ourselves on our integrity, professionalism, and extensive knowledge of the
            real estate market.
          </p>
          <p>
            Our mission is to connect people with their dream properties, whether it’s for buying,
            selling, or renting. We believe in building lasting relationships with our clients by
            delivering exceptional results and making the real estate journey a memorable experience.
          </p>
          <div className="boxes">
            <div className="box">
              <h1>100%</h1>
              <h2>Client Satisfaction</h2>
            </div>
            <div className="box">
              <h1>500+</h1>
              <h2>Happy Clients</h2>
            </div>
            <div className="box">
              <h1>3000+</h1>
              <h2>Properties Available</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
      <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default AboutUsPage;
    