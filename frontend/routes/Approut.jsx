import { createBrowserRouter } from "react-router-dom";
import Authlayout from "../layout/Authlayouts";
import Login from "../pages/Login";
import HotelAdmin from "../layout/HotelAdmin";
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Table from "../pages/Table";
import Menu from "../pages/Menu";
import CustomerLayout from "../layout/CustomerLayouts";
import Welcome from "../components/Welcome";
import { CustomerProvider } from "../context/CustomerContext";
import CustMenu from "../pages/CustMenu";
import CustOrder from "../pages/CustOrder";
import OrdersHotel from "../pages/OrdersHotel";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";

import MorePage from "../pages/MorePage";
import MyBillPage from "../pages/MyBillPage";
import RequestBillPage from "../pages/RequestBillPage";
import BillPreviewPage from "../pages/BillPreviewPage";
import PaymentMethodPage from "../pages/PaymentMethodPage";
import PaymentProcessingPage from "../pages/PaymentProcessingPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import RateFoodPage from "../pages/RateFoodPage";
import CallWaiterPage from "../pages/CallWaiterPage";
import NotificationsPage from "../pages/NotificationsPage";
import HelpSupportPage from "../pages/HelpSupportPage";
import AboutUsPage from "../pages/AboutUsPage";

const router = createBrowserRouter([
  {
    element: <Authlayout />,
    children: [
      { path: "/", element: <Login /> }
    ]
  },
  {
    path: "/hoteladmin",
    element: <HotelAdmin />,
    children: [
      { path: "Home", element: <Home /> },
      { path: "Dashboard", element: <Dashboard /> },
      { path: "Settings", element: <Settings /> },
      { path: "Table", element: <Table /> },
      { path: "Menu", element: <Menu /> },
      { path: "Orders", element: <OrdersHotel /> },
      { path: "Profile", element: <Profile /> }
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
      { index: true, element: <Welcome /> },
      { path: "Cmenu", element: <CustMenu /> },
      { path: "COrders", element: <CustOrder /> },

      { path: "more", element: <MorePage /> },
      { path: "more/bill", element: <MyBillPage /> },
      { path: "more/request-bill", element: <RequestBillPage /> },
      { path: "more/bill-preview", element: <BillPreviewPage /> },
      { path: "more/payment", element: <PaymentMethodPage /> },
      { path: "more/payment-processing", element: <PaymentProcessingPage /> },
      { path: "more/payment-success", element: <PaymentSuccessPage /> },
      { path: "more/feedback", element: <RateFoodPage /> },
      { path: "more/call-waiter", element: <CallWaiterPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "more/help", element: <HelpSupportPage /> },
      { path: "more/about", element: <AboutUsPage /> }
    ]
  }
]);

export default router;