import { createBrowserRouter } from "react-router-dom";
import Authlayout from "../layout/Authlayouts";
import Login from "../pages/Login";
import HotelAdmin from "../layout/HotelAdmin";
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Table from "../pages/Table";

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
      }
    ]
  }
])

export default router