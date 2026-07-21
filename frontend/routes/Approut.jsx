import { createBrowserRouter } from "react-router-dom";
import Authlayout from "../layout/Authlayouts";
import Login from "../pages/Login";
import HotelAdmin from "../layout/HotelAdmin";
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Table from "../pages/Table";
import Menu from "../pages/Menu"
import CustomerLayout from "../layout/CustomerLayouts";
import Welcome from "../components/Welcome";
   import { CustomerProvider } from "../context/CustomerContext";
import CustMenu from "../pages/CustMenu";

const router=createBrowserRouter([
    {
    element: <Authlayout />,
    children: [
      {
        path: "/",
        element: <Login />
      }
    ]
  },
  {
    path: "/hoteladmin",
    element: <HotelAdmin/>,
    children: [
      {
        path: "Home",
        element: <Home />
      },
      {
        path: "Settings",
        element: <Settings />
      },
       {
        path: "Table",
        element: <Table />
      },
      {
        path: "Menu",
        element: <Menu/>
      }
    ]
  },

  {
  path: "/customer/:tableId",
  element: (
    <CustomerProvider>
      <CustomerLayout />
    </CustomerProvider>
  ),
  children: [
    {
      index: true,
      element: <Welcome />
    },
    {
      path: "Cmenu",
      element: <CustMenu />
    },
    // {
    //   path: "cart",
    //   element: <Cart />
    // },
    // {
    //   path: "orders",
    //   element: <Orders />
    // }
  
  ]
}
])

export default router