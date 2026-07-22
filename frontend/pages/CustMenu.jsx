import React, { useEffect, useState,useContext } from "react";
import axios from "axios";
import CusMenuNav from "../components/CusMenuNav";
import { CustomerContext } from "../context/CustomerContext";
import CusDishCard from "../components/CusDishCard";


const CustMenu = () => {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const {url}=useContext(CustomerContext);
  const [selcat,setselcat]=useState("");
  const [searcher,setsearcher]=useState("");


  const fetchMenu = async () => {
    try {
      const res = await axios.get(
        `${url}/api/customer/menu`,
        {
          withCredentials: true,
        }
      );

      setDishes(res.data.dishes);
      setCategories(res.data.categories);
      console.log(res.data.dishes)
   

    } catch (error) {
      console.log(error);
    }
  };

  const filteredDishes = dishes.filter((dish) => {
      console.log("Selected:", selcat);
  console.log("Dish Category:", dish.categoryId);
   const categoryMatch =
  selcat === "" || dish.categoryId === selcat;
    const searchMatch =
        dish.dishName.toLowerCase().includes(searcher.toLowerCase());

    return categoryMatch && searchMatch;
}); 



  useEffect(() => {
    fetchMenu();
   
  }, []);
useEffect(()=>{
  console.log(dishes);
  console.log("from gandu",filteredDishes)
},[dishes])
  return (
    <div>
    <CusMenuNav
    categories={categories}
    setselcat={setselcat}
    setsearcher={setsearcher}
    />
    <div className="mt-6 flex flex-col gap-2">
      {filteredDishes.length > 0 ? (
        filteredDishes.map((dish) => (
          <CusDishCard
            key={dish._id}
            dish={dish}
  
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
  )
}

export default CustMenu
