import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function MyListings() {
  const [listings, setListings] = useState([]);

  const fetchListings = async () => {
    try {
      const { data } = await api.get("/listings/my");
      setListings(data.listings);
    } catch (error) {
      toast.error("Failed to load listings");
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const deleteListing = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/listings/${id}`);

      toast.success("Listing Deleted");

      setListings((prev) =>
        prev.filter((listing) => listing._id !== id)
      );
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <h1>My Listings</h1>

      {listings.length === 0 ? (
        <h3>No Listings Found</h3>
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

            <p>👥 Occupancy: {listing.occupancy}</p>

            <Link to={`/listings/${listing._id}`}>
              <button>View</button>
            </Link>

            {"  "}

            <Link to={`/listings/edit/${listing._id}`}>
              <button>Edit</button>
            </Link>

            {"  "}

            <button
              onClick={() => deleteListing(listing._id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default MyListings;