import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function OwnerInterests() {
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      const { data } = await api.get("/interests");
      setInterests(data.interests);
    } catch (error) {
  console.log(error);
  console.log(error.response);

  toast.error(
    error.response?.data?.message || "Failed to load interest requests"
  );
}
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/interests/${id}`, { status });

      toast.success(`Interest ${status}`);

      fetchInterests();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Interest Requests</h1>

      {interests.length === 0 ? (
        <h3>No Requests Yet</h3>
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
            <h2>{item.tenant.name}</h2>

            <p>📧 {item.tenant.email}</p>

            <p>🏠 {item.listing.title}</p>

            <p>💰 ₹{item.listing.rent}</p>

            <p>
              <strong>Status:</strong> {item.status}
            </p>

            {item.status === "Pending" ? (
              <>
                <button
                  onClick={() =>
                    updateStatus(item._id, "Accepted")
                  }
                >
                  Accept
                </button>

                {" "}

                <button
                  onClick={() =>
                    updateStatus(item._id, "Rejected")
                  }
                >
                  Reject
                </button>
              </>
            ) : item.status === "Accepted" ? (
              <Link
                to={`/chat/${item.tenant._id}/${item.listing._id}`}
              >
                <button>💬 Open Chat</button>
              </Link>
            ) : (
              <span style={{ color: "red" }}>
                Request Rejected
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default OwnerInterests;