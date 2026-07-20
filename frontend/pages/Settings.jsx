import React from "react";
import DeleteTable from "../components/DeleteTable";

const Settings = () => {
  const deltable = {
    id: "6a50a6453116b18b3f7d7ed3",
    tableNumber: 4,
    capacity: 4,
    location: "4",
    type: "AC",
    status: "available",
    hotelId: "6a50a4ec3116b18b3f7d7ec5",
    createdAt: "2026-07-10T07:59:01.472Z",
    __v: 0,
    qr: "uploads/hotel_6a50a4ec3116b18b3f7d7ec5/qr/table_6a50a6453116b18b3f7d7ed3.png",
  };

  return (
    <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
      <DeleteTable
        deltable={deltable}
        onCancel={() => console.log("Cancel")}
        onConfirm={() => console.log("Delete")}
      />
    </div>
  );
};

export default Settings;