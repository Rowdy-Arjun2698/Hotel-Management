import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { socket } from "../src/socket"; // Change path if your socket.js is elsewhere

const HotelAdmin = () => {
  const [user, setUser] = useState(null);

  async function fetchHotel() {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/hotel/fetchuser",
        {
          withCredentials: true,
        }
      );

      console.log("API Response:", response.data);

      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Fetch hotel once when component mounts
  useEffect(() => {
    fetchHotel();
  }, []);

  // Runs whenever user changes
  useEffect(() => {
    console.log("User:", user);

    if (!user?._id) return;

    socket.emit("joinHotel", user._id);

    console.log("Joined Hotel Room:", user._id);
  }, [user]);

  return (
    <div className="h-screen w-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-[#151514] flex-shrink-0 shadow-xl">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-gray-100">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default HotelAdmin;