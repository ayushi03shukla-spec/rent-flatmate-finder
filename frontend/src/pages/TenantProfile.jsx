import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

function TenantProfile() {
  const [formData, setFormData] = useState({
    preferredLocation: "",
    minBudget: "",
    maxBudget: "",
    moveInDate: "",
    occupation: "",
    foodPreference: "Both",
    smoking: false,
    drinking: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/profile");

      if (data.profile) {
        setFormData({
          ...data.profile,
          moveInDate: data.profile.moveInDate
            ? data.profile.moveInDate.substring(0, 10)
            : "",
        });
      }
    } catch (error) {
      console.log("No profile found.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/profile", formData);

      toast.success("Profile Saved");
    } catch (error) {
      toast.error("Unable to save profile");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h1>Tenant Profile</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="preferredLocation"
          placeholder="Preferred Location"
          value={formData.preferredLocation}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="number"
          name="minBudget"
          placeholder="Minimum Budget"
          value={formData.minBudget}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="number"
          name="maxBudget"
          placeholder="Maximum Budget"
          value={formData.maxBudget}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="date"
          name="moveInDate"
          value={formData.moveInDate}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="text"
          name="occupation"
          placeholder="Occupation"
          value={formData.occupation}
          onChange={handleChange}
        />

        <br /><br />

        <select
          name="foodPreference"
          value={formData.foodPreference}
          onChange={handleChange}
        >
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
          <option value="Both">Both</option>
        </select>

        <br /><br />

        <label>
          <input
            type="checkbox"
            name="smoking"
            checked={formData.smoking}
            onChange={handleChange}
          />
          Smoking
        </label>

        <br /><br />

        <label>
          <input
            type="checkbox"
            name="drinking"
            checked={formData.drinking}
            onChange={handleChange}
          />
          Drinking
        </label>

        <br /><br />

        <button type="submit">
          Save Profile
        </button>

      </form>
    </div>
  );
}

export default TenantProfile;