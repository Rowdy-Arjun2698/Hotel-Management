import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
const HotelAdmin = () => {
  return (
    <>
    <div className="big w-screen h-screen flex flex-row">
  <div className="w-[15vw] h-full bg-[#151514ff] "><Sidebar /></div>

   <div className="w-[85vw] h-full bg-amber-100 flex flex-col gap-2 ">
     <Outlet />
   </div>

    </div>
     
     
    </>
    
  )
}

export default HotelAdmin
