import React from "react";

const QrModel = ({ qr, tableNumber, onClose }) => {
    console.log(qr)
    console.log(tableNumber)
    console.log(onClose)
    const downloadQR = async () => {
  const response = await fetch(`http://localhost:3000/${qr}`);
  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `Table-${tableNumber}-QR.png`;
  link.click();

  window.URL.revokeObjectURL(url);
  onClose()
};
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-8 w-[420px] flex flex-col items-center gap-6"
      >
        <h2 className="text-2xl font-bold">
          Table {tableNumber} QR
        </h2>

        <img
          src={`http://localhost:3000/${qr}`}
          alt="QR Code"
          className="w-64 h-64 object-contain border rounded-xl"
        />

        <div className="flex gap-4">
          <button
        onClick={downloadQR}
        className="px-5 py-2 bg-[#d2873a] text-white rounded-lg"

          >
            Download QR
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrModel;