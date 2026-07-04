import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <h2>Loading...</h2>;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

      <h2>Welcome, {user.name}</h2>

      <p>Email: {user.email}</p>

      <p>Role: {user.role}</p>

      <hr />

      <Link to="/listings">
        <button>Browse Listings</button>
      </Link>

      <br />
      <br />

      {user.role === "owner" ? (
        <>
          <Link to="/listings/create">
            <button>Create Listing</button>
          </Link>

          <br />
          <br />

          <Link to="/my-listings">
            <button>My Listings</button>
          </Link>

          <br />
          <br />

          <Link to="/owner/interests">
            <button>Interest Requests</button>
          </Link>

          <br />
          <br />
        </>
      ) : (
        <>
          <Link to="/profile">
            <button>My Profile</button>
          </Link>

          <br />
          <br />

          <Link to="/my-interests">
            <button>My Interest Requests</button>
          </Link>

          <br />
          <br />
        </>
      )}

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;