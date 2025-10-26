import React, { useState } from "react";
import GuestHouseBooking from "./GuestHouseBooking";
import AdminPage from "./AdminPage";
import AdminLogin from "./AdminLogin";

export default function App() {
  const [view, setView] = useState("booking"); // booking | login | admin

  const handleAdminAccess = () => {
    setView("login");
  };

  const handleLoginSuccess = () => {
    setView("admin");
  };

  const handleBackToBooking = () => {
    setView("booking");
  };

  return (
    <div>
      {view === "booking" && <GuestHouseBooking onAdminClick={handleAdminAccess} />}
      {view === "login" && <AdminLogin onLoginSuccess={handleLoginSuccess} onCancel={handleBackToBooking} />}
      {view === "admin" && <AdminPage onBack={handleBackToBooking} />}
    </div>
  );
}
