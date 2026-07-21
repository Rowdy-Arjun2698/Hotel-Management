import React from "react";
import { useState,useEffect,useContext } from "react";
import { Outlet, useNavigate,useParams } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { CustomerContext } from "../context/CustomerContext";
import Loader from "../components/Loader";
import axios from "axios";

const CustomerLayout = () => {
    const url = import.meta.env.VITE_BACKEND_URL;
    

  const navigate = useNavigate();

  const { tableId } = useParams();
  

  const [loading,setLoading] = useState(true);


  const {
    setHotel,
    setTable,
    setSession
  } = useContext(CustomerContext);



  useEffect(()=>{

    const fetchCustomerData = async()=>{

      try{

        const res = await axios.get( `${url}/api/customer/start/${tableId}`,
             {
    withCredentials:true
  }
        );


        setHotel(res.data.hotel);
        setTable(res.data.table);
        setSession(res.data.session);
            console.log(res.data.table);

      }
      catch(err){
        console.log(err);
      }
      finally{
        setLoading(false);
      }

    }


    if(tableId){
      fetchCustomerData();
    }


  },[tableId]);




  if(loading){
     return <Loader message="Fetching Table data"/>
  }

  return (
    
    <div className="h-screen w-screen bg-slate-100 flex justify-center">
      {/* Mobile Container */}
      <div className="relative h-screen w-full max-w-md bg-white shadow-2xl shadow-slate-300/50 overflow-hidden sm:my-4 sm:h-[calc(100vh-2rem)] sm:rounded-[2.5rem] sm:border sm:border-slate-200">

        {/* Fixed Header */}
        <div
          className="sticky top-0 z-20 bg-white border-b border-slate-100"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <Header
            notificationCount={2}
            onMenuClick={() => {}}
            onBellClick={() => navigate("/notifications")}
          />
        </div>

        {/* Scrollable Content */}
        <main className="h-[calc(100%-5.5rem-4.5rem)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <div
          className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-slate-100 shadow-[0_-8px_24px_-8px_rgba(15,23,42,0.08)]"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <BottomNav />
        </div>
      </div>
    </div>
  
  );
};

export default CustomerLayout;