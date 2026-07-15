import React, { useState, useEffect } from "react";
import axios from "axios";

import AddTable from "../components/AddTable";
import TableCard from "../components/TableCard";
import TableForm from "../components/TableForm";

const Table = () => {
  const [open, setOpen] = useState(false);
  const [allTables, setAllTables] = useState([]);

  async function fetchAllTables() {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/table/getalltables",
        {
          withCredentials: true,
        }
      );

    

     setAllTables(response.data.data);
       

    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  }

  useEffect(() => {
    fetchAllTables();
   
  }, [allTables]);

  return (
    <div className="w-full h-full bg-white flex flex-wrap gap-5 overflow-y-auto">

      {allTables.map((card) => (
        <TableCard
          key={card._id}
          tableData={card}
        />
      ))}

      <AddTable onClick={() => {console.log("cliked btn")
        setOpen(true)}} />

      {open && (
        <TableForm onClose={() => setOpen(false)} />
      )}

    </div>
  );
};

export default Table;