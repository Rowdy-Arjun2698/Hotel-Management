import React from 'react'
import CategoryNav  from "../components/CategoryNav"
import { useState,useEffect } from 'react';
import AddCatagoryForm from '../components/AddCatagoryForm';
import AddDishForm from '../components/AddDishForm';
import axios from "axios";

const Menu = () => {
  const [openform,setopenform]=useState(false);
    const [categories, setCategories] = useState([]);
  const [dishform,setdish]=useState(false);
  const [refreshCategories, setRefreshCategories] = useState(false);
  const refresh = () => {
  setRefreshCategories(prev => !prev);
};
 async function fetchAllCategory() {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/menu/fetch_cat",
        {
          withCredentials: true,
        }
      );
        console.log(response.data.categories);
      setCategories(response.data.categories);
    } catch (err) {
      console.log(err);
    }
  }

  console.log(categories);

  useEffect(() => {
    fetchAllCategory();
  }, []);
  return (
    <div className="w-full h-full flex flex-col bg-white" >
      <CategoryNav setopenform={setopenform} refreshCategories={refreshCategories} categories={categories} setdish={setdish}/>

        
      {dishform && (
        
        <AddDishForm
        categories={categories}
        
        onClose={()=> setdish(false)}
        onSuccess={()=>{
          setdish(false),
          refresh(),
           fetchAllCategory(); 
        }}
        

        />
      )}

      
       {openform && (
        <AddCatagoryForm
          onClose={() => setopenform(false)}
           onSuccess={() => {
      setopenform(false);
      refresh();
       fetchAllCategory(); 
    }}
        />
      )}
    </div>
  )


}

export default Menu
