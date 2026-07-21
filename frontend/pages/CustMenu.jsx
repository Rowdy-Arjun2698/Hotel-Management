import React, { useEffect, useState,useContext } from "react";
import axios from "axios";
import CusMenuNav from "../components/CusMenuNav";
import { CustomerContext } from "../context/CustomerContext";


const CustMenu = () => {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const {url}=useContext(CustomerContext);

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
     console.log("from parent",categories)

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <div>
    <CusMenuNav
    categories={categories}
    />  
    </div>
  )
}

export default CustMenu
