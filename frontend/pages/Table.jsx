import React, { useState, useEffect } from "react";
import axios from "axios";

import AddTable from "../components/AddTable";
import TableCard from "../components/TableCard";
import TableForm from "../components/TableForm";
import DeleteTable from "../components/DeleteTable";
import TableNav from "../components/TableNav"
const Table = () => {
  const [open, setOpen] = useState(false);
  const [allTables, setAllTables] = useState([]);
  const [table,setTable]=useState(null);
  const [del,setdel]=useState(false);
  const [search, setSearch] = useState("");
  

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


//handleing the delete
async function handleDelete() {

  try {
    await axios.delete(`http://localhost:3000/api/table/delete_table/${table._id}`,
      {
        withCredentials: true,
      }
    )
    await fetchAllTables();   // refresh after delete
    setdel(false);
  } catch (error) {
    console.log(error);
  }
  
}

const filteredTables = allTables.filter((table) =>
  table.tableNumber.toString().includes(search.trim())
);

  useEffect(() => {
    fetchAllTables();
   
  }, []);

 return (
  <div className="w-full h-full bg-gray-100 flex flex-col">

    {/* Navbar */}
    <TableNav
      search={search}
      setSearch={setSearch}
      setOpenForm={() => setOpen(true)}
    />

    {/* Cards */}
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex flex-wrap gap-5">
        {filteredTables.map((card) => (
          <TableCard
            key={card._id}
            tableData={card}
            openDelete={() => setdel(true)}
            setTable={setTable}
          />
        ))}
        <AddTable onClick={() => setOpen(true)} />
      </div>
      
    </div>

    {del && (
      <DeleteTable
        deltable={table}
        onCancel={() => setdel(false)}
        onConfirm={handleDelete}
      />
    )}

  

    {open && (
      <TableForm
        onClose={() => {
          setOpen(false);
          fetchAllTables();
        }}
      />
    )}
  </div>
)
}

export default Table;