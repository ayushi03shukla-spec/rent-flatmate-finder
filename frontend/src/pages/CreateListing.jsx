import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function CreateListing() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    address: "",
    rent: "",
    occupancy: "",
    roomType: "Shared",
    genderPreference: "Any",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/listings", {
        ...formData,
        rent: Number(formData.rent),
        occupancy: Number(formData.occupancy),
      });

      toast.success("Listing Created Successfully");
      navigate("/my-listings");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Server Error"
      );
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h1>Create Listing</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <br /><br />

        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="text"
          name="address"
          placeholder="Full Address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="number"
          name="rent"
          placeholder="Rent"
          value={formData.rent}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="number"
          name="occupancy"
          placeholder="Occupancy"
          value={formData.occupancy}
          onChange={handleChange}
          required
        />

        <br /><br />

        <select
          name="roomType"
          value={formData.roomType}
          onChange={handleChange}
        >
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Shared">Shared</option>
        </select>

        <br /><br />

        <select
          name="genderPreference"
          value={formData.genderPreference}
          onChange={handleChange}
        >
          <option value="Any">Any</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <br /><br />

        <button type="submit">
          Create Listing
        </button>

      </form>
    </div>
  );
}

export default CreateListing;