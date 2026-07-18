import React from 'react'
import CategoryNav  from "../components/CategoryNav"
import { useState,useEffect } from 'react';
import AddCatagoryForm from '../components/AddCatagoryForm';
import AddDishForm from '../components/AddDishForm';
import axios from "axios";
import DishCard from '../components/DishCard';
import DeleteDishForm from '../components/DeleteDishForm';

const Menu = () => {
  const [openform,setopenform]=useState(false);
    const [categories, setCategories] = useState([]);
    const [dishes,setdishes]=useState([]);
  const [dishform,setdish]=useState(false);
  const [refreshCategories, setRefreshCategories] = useState(false);
  const [search, setSearch] = useState("");
  const [selcat,setselcat]=useState("");
  const [deldish,setdeldish]=useState({});
  const [deletedish,setdeletedish]=useState(false);

  
  
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
      setCategories(response.data.categories);
    } catch (err) {
      console.log(err);
    }
  }

//....................fetching dishes..............................................//
async function fetchAlldishes() {
  try {
    const response = await axios.get(
        "http://localhost:3000/api/menu/fetch_dishes",
        {
          withCredentials: true,
        }
      );

      setdishes(response.data.dishes);
  } catch (error) {
    console.log(error);
    
  }
  
}

//delete the dish................................................
async function deletethis(di) {
 
  try {
    await axios.delete(`http://localhost:3000/api/menu/delete_dish/${di._id}`,
      {
        withCredentials: true,
      }
    )
    await fetchAlldishes();   // refresh after delete
    setdeletedish(false);
  } catch (error) {
    console.log(error);
  }
  
}
//...............................................................

const filteredDishes = dishes.filter((dish) => {
    const categoryMatch =
        selcat === "" || dish.categoryId === selcat;

    const searchMatch =
        dish.dishName.toLowerCase().includes(search.toLowerCase());

    return categoryMatch && searchMatch;
});  


  useEffect(() => {
    fetchAllCategory();
    fetchAlldishes();
  }, []);
  return (
  <div className="min-h-full bg-gray-100">

    <CategoryNav
      setopenform={setopenform}
      refreshCategories={refreshCategories}
      categories={categories}
      setdish={setdish}
      setselcat={setselcat}
      setSearch={setSearch}
      search={search}
    />

    {dishform && (
      <AddDishForm
        categories={categories}
        onClose={() => setdish(false)}
        onSuccess={() => {
          setdish(false);
          fetchAlldishes();
          fetchAllCategory();
        }}
      />
    )}

{deletedish && (
  <DeleteDishForm
  onCancel={()=>setdeletedish(false)}
  deldish={deldish}
  onConfirm={()=>{
    deletethis(deldish)
  }}
  
  />
  
)}

    {openform && (
      <AddCatagoryForm
        onClose={() => setopenform(false)}
        onSuccess={() => {
          setopenform(false);
          fetchAllCategory();
        }}
      />
    )}

    <div className="mt-6 flex flex-col gap-4">
      {filteredDishes.length > 0 ? (
        filteredDishes.map((dish) => (
          <DishCard
            key={dish._id}
            dish={dish}
            setdeldish={setdeldish}
            setdeletedish={setdeletedish}
          />
        ))
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm ring-1 ring-black/5">
          <h2 className="text-lg font-semibold text-gray-700">
            No dishes found
          </h2>
          <p className="text-gray-500 mt-2">
            Add a new dish or change the selected category.
          </p>
        </div>
      )}
    </div>

  </div>
);


}

export default Menu
