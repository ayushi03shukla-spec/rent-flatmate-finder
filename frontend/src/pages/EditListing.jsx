import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function EditListing() {
  const { id } = useParams();
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

  useEffect(() => {
    fetchListing();
  }, []);

  const fetchListing = async () => {
    try {
      const { data } = await api.get(`/listings/${id}`);

      setFormData({
        title: data.title,
        description: data.description,
        city: data.city,
        address: data.address,
        rent: data.rent,
        occupancy: data.occupancy,
        roomType: data.roomType,
        genderPreference: data.genderPreference,
      });
    } catch (error) {
      toast.error("Failed to load listing");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/listings/${id}`, {
        ...formData,
        rent: Number(formData.rent),
        occupancy: Number(formData.occupancy),
      });

      toast.success("Listing Updated Successfully");

      navigate("/my-listings");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update Failed"
      );
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h1>Edit Listing</h1>

      <form onSubmit={handleSubmit}>

        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <br /><br />

        <textarea
          name="description"
          rows="4"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="address"
          placeholder="Address"
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
          Update Listing
        </button>

      </form>
    </div>
  );
}

export default EditListing;