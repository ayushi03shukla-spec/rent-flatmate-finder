import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function ListingDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);

  useEffect(() => {
    fetchListing();
  }, []);

  const fetchListing = async () => {
    try {
      const { data } = await api.get(`/listings/${id}`);
      setListing(data);
    } catch (error) {
      toast.error("Failed to load listing");
    }
  };

  const sendInterest = async () => {
    try {
      await api.post(`/interests/${listing._id}`);

      toast.success("Interest Sent Successfully ❤️");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send interest"
      );
    }
  };

  if (!listing) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h1>{listing.title}</h1>

      <hr />

      <p><b>📍 City:</b> {listing.city}</p>

      <p><b>🏠 Address:</b> {listing.address}</p>

      <p><b>💰 Rent:</b> ₹{listing.rent}</p>

      <p><b>🛏 Room Type:</b> {listing.roomType}</p>

      <p><b>👥 Occupancy:</b> {listing.occupancy}</p>

      <p><b>🚻 Gender Preference:</b> {listing.genderPreference}</p>

      <p><b>📝 Description:</b></p>

      <p>{listing.description}</p>

      <hr />

      <p>
        <b>Owner:</b> {listing.owner.name}
      </p>

      <p>
        <b>Email:</b> {listing.owner.email}
      </p>

      <p>
        <b>Phone:</b> {listing.owner.phone}
      </p>

      {user?.role === "tenant" && (
        <button onClick={sendInterest}>
          ❤️ Send Interest
        </button>
      )}
    </div>
  );
}

export default ListingDetails;