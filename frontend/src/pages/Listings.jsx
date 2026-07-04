import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function Listings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data } = await api.get("/listings");
      setListings(data.listings || data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Available Listings</h1>

      {listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        listings.map((listing) => (
          <div
            key={listing._id}
            style={{
              border: "1px solid gray",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          >
            <h2>{listing.title}</h2>

            <p>📍 {listing.city}</p>

            <p>💰 ₹{listing.rent}</p>

            <p>{listing.description}</p>

            <br />

            <Link to={`/listings/${listing._id}`}>
              <button>View Details</button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default Listings;