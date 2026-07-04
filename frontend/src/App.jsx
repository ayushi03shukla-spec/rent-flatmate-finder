import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Listings from "./pages/Listings";
import CreateListing from "./pages/CreateListing";
import ListingDetails from "./pages/ListingDetails";
import MyListings from "./pages/MyListings";
import ProtectedRoute from "./components/ProtectedRoute";
import EditListing from "./pages/EditListing";
import OwnerInterests from "./pages/OwnerInterests";
import Chat from "./pages/Chat";
import MyInterests from "./pages/MyInterests";
import TenantProfile from "./pages/TenantProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <TenantProfile />
    </ProtectedRoute>
  }
/>
        <Route
  path="/my-interests"
  element={
    <ProtectedRoute>
      <MyInterests />
    </ProtectedRoute>
  }
/>
        <Route
  path="/chat/:receiverId/:listingId"
  element={
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  }
/>

        <Route
          path="/listings"
          element={
            <ProtectedRoute>
              <Listings />
            </ProtectedRoute>
          }
        />
        <Route
  path="/owner/interests"
  element={
    <ProtectedRoute>
      <OwnerInterests />
    </ProtectedRoute>
  }
/>

        <Route
          path="/listings/create"
          element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/listings/:id"
          element={
            <ProtectedRoute>
              <ListingDetails />
            </ProtectedRoute>
          }
        />
        <Route
  path="/listings/edit/:id"
  element={
    <ProtectedRoute>
      <EditListing />
    </ProtectedRoute>
  }
/>

        <Route
          path="/my-listings"
          element={
            <ProtectedRoute>
              <MyListings />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;