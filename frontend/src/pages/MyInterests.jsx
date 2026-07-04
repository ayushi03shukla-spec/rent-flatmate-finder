import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function MyInterests() {
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      const { data } = await api.get("/interests/my");
      setInterests(data.interests);
    } catch (error) {
      toast.error("Failed to load interests");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>My Interest Requests</h1>

      {interests.length === 0 ? (
        <h3>No Interest Requests</h3>
      ) : (
        interests.map((item) => (
          <div
            key={item._id}
            style={{
              border: "1px solid gray",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          >
            <h2>{item.listing.title}</h2>

            <p>📍 {item.listing.city}</p>

            <p>💰 ₹{item.listing.rent}</p>

            <p>👤 Owner: {item.owner.name}</p>

            <p>
              <strong>Status:</strong> {item.status}
            </p>

            {item.status === "Accepted" && (
              <Link to={`/chat/${item.owner._id}/${item.listing._id}`}>
                <button>💬 Open Chat</button>
              </Link>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyInterests;