import React from 'react'
import { useContext } from 'react'
import { CustomerContext } from "../context/CustomerContext";
import Orders from '../components/Orders';
const CustOrder = () => {
const{items,setitems}=useContext(CustomerContext)
console.log(items);

  return (
    <div>
      <Orders/>
    </div>
  )
}

export default CustOrder
