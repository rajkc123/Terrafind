import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import Map from "../../components/map/Map";
import Slider from "../../components/slider/Slider";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import "./singlePage.scss";

function SinglePage() {
  const post = useLoaderData();
  console.log(post)
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const handleSendMessage = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    try {
      // Navigate to the profile page with the user's ID
      console.log("Navigating with chatUserId:", post.userId); 

      navigate("/profile", { state: { chatUserId: post.userId } });
    } catch (error) {
      console.error("Failed to initiate chat", error);
    }
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">NPR {post.price}</div>
              </div>
              <div className="user">
                <img src={post.user?.avatar || "noavatar.jpg"} alt="" />
                <span>{post.user?.username || "Anonymous"}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail?.desc || "No description available."),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            {post.postDetail ? (
              <>
                <div className="feature">
                  <img src="/utility.png" alt="" />
                  <div className="featureText">
                    <span>Utilities</span>
                    {post.postDetail.utilities === "owner" ? (
                      <p>Owner is responsible</p>
                    ) : (
                      <p>Tenant is responsible</p>
                    )}
                  </div>
                </div>
                <div className="feature">
                  <img src="/pet.png" alt="" />
                  <div className="featureText">
                    <span>Pet Policy</span>
                    {post.postDetail.pet === "allowed" ? (
                      <p>Pets Allowed</p>
                    ) : (
                      <p>Pets not Allowed</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p>No general details available.</p>
            )}
          </div>

          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail?.size || "N/A"} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom || "N/A"} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom || "N/A"} bathroom</span>
            </div>
          </div>

          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            {post.postDetail ? (
              <>
                <div className="feature">
                  <img src="/school.png" alt="" />
                  <div className="featureText">
                    <span>School</span>
                    <p>
                      {post.postDetail.school > 999
                        ? post.postDetail.school / 1000 + "km"
                        : post.postDetail.school + "m"}{" "}
                      away
                    </p>
                  </div>
                </div>
                <div className="feature">
                  <img src="/pet.png" alt="" />
                  <div className="featureText">
                    <span>Bus Stop</span>
                    <p>{post.postDetail.bus}m away</p>
                  </div>
                </div>
                <div className="feature">
                  <img src="/fee.png" alt="" />
                  <div className="featureText">
                    <span>Restaurant</span>
                    <p>{post.postDetail.restaurant}m away</p>
                  </div>
                </div>
              </>
            ) : (
              <p>No nearby places information available.</p>
            )}
          </div>

          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <button onClick={handleSendMessage}>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
