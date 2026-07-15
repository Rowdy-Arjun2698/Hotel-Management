import React from 'react'
import CategoryNav  from "../components/CategoryNav"
import { useState } from 'react';
import AddCatagoryForm from '../components/AddCatagoryForm';

const Menu = () => {
  const [openform,setopenform]=useState(false);
  const [refreshCategories, setRefreshCategories] = useState(false);
  const refresh = () => {
  setRefreshCategories(prev => !prev);
};
  return (
    <div className="w-full h-full flex flex-col bg-white" >
      <CategoryNav setopenform={setopenform} refreshCategories={refreshCategories} />
      
       {openform && (
        <AddCatagoryForm
          onClose={() => setopenform(false)}
           onSuccess={() => {
      setopenform(false);
      refresh();
    }}
        />
      )}
    </div>
  )


}

export default Menu
