import React, { useState, useEffect } from "react";
import axios from "axios";

import AddTable from "../components/AddTable";
import TableCard from "../components/TableCard";
import TableForm from "../components/TableForm";
import DeleteTable from "../components/DeleteTable";
import TableNav from "../components/TableNav"
import TableEdit from "../components/TableEdit";
import { Toaster } from "../components/Toaster";
const Table = () => {
  const [open, setOpen] = useState(false);
  const [allTables, setAllTables] = useState([]);
  const [table,setTable]=useState(null);
  const [del,setdel]=useState(false);
  const [search, setSearch] = useState("");
  const [tb,settb]=useState(null);
  const [tbopen,settbopen]=useState(false);
  const [toast, setToast] = useState({ show: false, success: true, message: "" });
  
    const fire = (success, message) => setToast({ show: true, success, message });

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
    fire(true, "Table deleted successfully!");
  } catch (error) {
    console.log(error);
    fire(false, "Table is not deleted");
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
            openEdit={()=>{settbopen(true)}}
            settb={settb}
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

  {tbopen &&(
    <TableEdit
    table={tb}
    onClose={()=>{
      settbopen(false)
    }}
    onSuccess={ ()=>{
settbopen(false)
    }}
    fetchAllTables={fetchAllTables}
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

     <Toaster
      show={toast.show}
      success={toast.success}
      message={toast.message}
      onClose={() =>
        setToast((prev) => ({ ...prev, show: false }))
      }
    />
  </div>
)
}

export default Table;