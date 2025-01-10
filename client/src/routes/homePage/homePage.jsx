import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import { AuthContext } from "../../context/AuthContext";
import "./homePage.scss";

function HomePage() {

  const {currentUser} = useContext(AuthContext)

  return (
    // ndidnbjgi
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1>Terrafind : A real-state Platform</h1>
          <h1 className="title">Find Your Dream Place with us</h1>

          <SearchBar />
          {/* imported from components */}
          <div className="boxes">
            <div className="box">
              <h1>Trusted and Reliable</h1>
              
            </div>
            <div className="box">
              
            </div>
            <div className="box">
              <h1>2000+</h1>
            <h2>Property Available</h2>
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

export default HomePage;
